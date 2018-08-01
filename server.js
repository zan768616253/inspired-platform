const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const multer = require('multer');
const EventProxy = require('eventproxy')
const moment = require('moment')
const _ = require('lodash')

const User = require("./server/models/User")
const rooms = require("./server/models/groupList")
const Gallery = require("./server/models/Gallery")

const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

// Create our app
const app = express();
const PORT = process.env.PORT || 3000;
const server = require("http").Server(app);
const io = require("socket.io")(server);

let users, connections;

users = [];
connections = [];

mongoose.connect("mongodb://localhost/kola");
const gfs = Grid(mongoose.connection.db, mongoose.mongo);

// app.use(compression());

app.get('/bundle.js', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    next();
});

// must use cookieParser before expressSession
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});
app.use(function (req, res, next) {
    if (req.headers["x-forwarded-proto"] === "https") {
        res.redirect("http://" + req.hostname + req.url);
    } else {
        next();
    }
});

app.use(express.static("public"));
app.use(cookieParser());

app.use(
    expressSession({
        secret: "inspired-token",
        saveUninitialized: false,
        name: "inspired-cookie",
        resave: false,
        cookie: {
            secure: false,
            maxAge: 6000000
        }
    })
);

const storage = GridFsStorage({
    url: 'mongodb://localhost/kola',
    file: (req, file) => {
        return {
            filename: 'file_' + Date.now()
        };
    }
});

const upload = multer({
    storage: storage
});

server.listen(PORT);

app.post("/api/user", function (req, res) {
    const ep = new EventProxy()

    const user = new User(req.body)

    ep.on('find no user', () => {
        user.save(function (err, u) {
            if (u) {
                res.send(u)
            }
        });
    })

    User.findOne({user_id: req.body.user_id}, function (err, doc) {
        if (doc) {
            res.send(doc)
        } else {
            ep.emit('find no user')
        }
    });
});

app.post("/api/user/friendrequest", function (req, res) {
    var friendship = new Friendships(req.body);

    Friendships.find({}, function (err, docs) {
        friendship.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
});


app.post("/api/user/removefriend", function (req, res) {
    Friendships.findOne(
        {
            user_id: req.body.user_id,
            other_id: req.body.other_id,
            status: "friend"
        },
        function (error, friendship) {
            console.log(error);
        }
    );
});

app.post("/api/user/updateinfo", (req, res) => {
    const phone = req.body.phone
    const childrennumber = req.body.childrennumber
    const hometown = req.body.hometown
    const expertise = req.body.expertise
    const culture = req.body.culture
    const belief = req.body.belief
    const bio = req.body.bio
    const desc = req.body.desc

    const set = {
        phone: phone,
        childrennumber: childrennumber,
        hometown: hometown,
        expertise: expertise,
        culture: culture,
        belief: belief,
        bio: bio,
        desc: desc
    }

    User.findOneAndUpdate(
        {user_id: req.body.user_id},
        {$set: set},
        (err, doc) => {
            if (err) {
                res.send({error: 500})
            }
            res.send(doc)
        }
    )
})

app.post("/api/gallery/uploadimage", upload.array('files', 99), (req, res) => {
    const user_id = req.body.user_id
    const files = req.files
    const pictures = _.map(files, file => {
        return file.filename
    })

    const data = {
        title: '',
        user_id: user_id,
        pictures: pictures
    }

    const gallery = new Gallery(data);

    gallery.save((err, doc) => {
        if (err) {
            console.log(err)
        }
        res.send({gallery: doc})
    })
})

app.post("/api/chat/uploadimage", upload.single('file'), (req, res) => {
    const fileName = req.file.filename
    res.send({filename: fileName})
})

app.post("/api/user/updateavatar", upload.single('file'), (req, res) => {
    const fileName = req.file.filename
    const user_id = req.file.originalname
    User.findOneAndUpdate(
        {user_id: user_id},
        {$set: {avatar: fileName}},
        (err, doc) => {
            if (err) {
                res.send({error: 500})
            }
            res.send({filename: fileName})
        }
    )
})

app.get('/api/message/image/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if (file) {
            const readstream = gfs.createReadStream({
                filename: file.filename
            });
            res.set('Content-Type', file.contentType)
            readstream.pipe(res)
        } else {
            res.send({error: 500})
        }
    })
})

app.get('/api/user/avatar/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if (file) {
            const readstream = gfs.createReadStream({
                filename: file.filename
            });
            res.set('Content-Type', file.contentType)
            readstream.pipe(res)
        } else {
            res.send({error: 500})
        }
    })
});

app.post("/api/user/emailnotif", function (req, res) {
    User.findOneAndUpdate(
        {user_id: req.body.user_id},
        {$set: {emailnotif: req.body.emailnotif}},
        {upsert: true},
        function (err, doc) {
            if (err) {
                console.log(err);
            }
        }
    );
});

app.post("/api/createGroup", function (req, res) {
    let _id;
    var data = {
        groupname: req.body.groupname,
        avatarletter: req.body.avatarletter,
        conversation: [],
        participants: JSON.parse(req.body.mapping),
        admin_id: req.body.id
    };
    var room = new rooms(data);

    rooms.find({}, function (err, docs) {
        room.save(function (err, docs) {
            if (err) {
                console.log(err);
            } else {
                _id = docs._id;

                var participants = JSON.parse(req.body.mapping);
                var val = 0;
                for (var i = 0; i < participants.length; i++) {
                    User.findOneAndUpdate(
                        {user_id: participants[i].user_id},
                        {
                            $push: {
                                rooms: {
                                    roomId: _id,
                                    roomName: req.body.groupname,
                                    pic: req.body.avatarletter,
                                    read_notes_count: val,
                                    read_count: val,
                                    total_count: val,
                                    total_notes_count: val
                                }
                            }
                        },
                        function (err) {
                            if (err) console.log(err);
                            else {
                                console.log(err);
                            }
                        }
                    );
                }
            }
        });
    });
});

app.post("/api/user/acceptrequestadd", function (req, res) {
    var status = req.body.status;
    Friendships.findOneAndUpdate(
        {
            user_id: req.body.uid,
            other_id: req.body.user_id,
            status: "pending"
        },
        {
            $set: {
                status: status
            }
        }
    )
        .then(() => {
        })
        .catch(err => {
            console.log(err.stack);
        });
});

app.get("/api/userall", function (req, res) {
    User.find({}, function (err, users) {
        res.send(users);
    });
});

app.get("/api/user/groupList", function (req, res) {
    rooms.find({}, function (err, rooms) {
        res.send(rooms);
    });
});

app.get("/api/userbyuId/:uId", function (req, res) {
    mongoose.model("User").find({uId: req.params.uId}, function (err, User) {
        if (err) console.log(err);
        res.send(JSON.stringify(User));
    });
});

app.get("/api/user/:uId", function (req, res) {
    mongoose.model("User").find({user_id: req.params.uId}, function (err, User) {
        if (err) console.log(err);
        if (JSON.stringify(User)) {
        }
        res.send(JSON.stringify(User));
    });
});
app.get("/api/user/:roomId", function (req, res) {
    rooms.find({_id: req.params.roomId}, function (err, rooms) {
        if (err) {
            console.log(err);
        } else {
            res.send(rooms);
        }
    });
});

app.get("/api/user/:user_id", function (req, res) {
    mongoose
        .model("User")
        .find({user_id: req.params.user_id}, function (err, User) {
            if (err) console.log(err);
            res.send(JSON.stringify(User));
        });
});
app.get("/api/rooms/:roomId", function (req, res) {
    rooms.find({_id: req.params.roomId}, function (err, room) {
        if (err) {
            console.log(err);
        } else {
            res.send(room);
        }
    });
});

app.get("/api/user", function (req, res) {
    mongoose.model("User").find(function (err, User) {
        res.send(JSON.stringify(User));
    });
});

app.get("/api/notification/:user_id", (req, res) => {

    User.findOne(
        {user_id: req.params.user_id},
        "rooms",
        (err, results) => {
            if (err) {
                console.log(err)
            } else {
                if (results) {
                    const ep = new EventProxy()
                    const rs = results.rooms || []

                    rs.forEach(room => {
                        const room_id = room.roomId
                        rooms.findOne(
                            {_id: room_id},
                            "conversation",
                            (err, r) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    ep.emit('get_conversation', {roomId: room_id, conversation: r.conversation})
                                }
                            }
                        )
                    })

                    ep.after('get_conversation', rs.length, conversations => {
                        const notifications = _.map(conversations, c => {
                            const roomId = c.roomId
                            const roomFound = rs.find(r => {
                                return r.roomId = roomId
                            })
                            if (roomFound) {
                                const leave_time = roomFound.leave_time
                                const unreads = _.filter(c.conversation, cc => {
                                    return cc.time >= leave_time
                                })
                                const reads = _.filter(c.conversation, cc => {
                                    return cc.time < leave_time
                                })

                                return {roomId: roomId, unread: unreads, read: reads}
                            }
                        })

                        res.send(notifications);
                    })
                } else {
                    res.send([]);
                }
            }
        }
    )


})

app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "public", "index.html"));
});

io.on("connection", function (socket) {
    connections.push(socket);

    //Disconnect
    socket.on("disconnect", function (data) {
        users.splice(users.indexOf(socket.username), 1);
        connections.splice(connections.indexOf(socket), 1);
    });

    socket.on("send gallery message", data => {
        rooms.update(
            {_id: data.roomId},
            {
                $push: {
                    conversation: {
                        from: socket.username,
                        user_name: data.user_name,
                        picture: data.picture,
                        roomId: data.roomId,
                        gallery: data.gallery
                    }
                }
            },
            function (err) {
                if (err)
                    console.log(err);
                else {
                    rooms.findOne({_id: data.roomId}).populate('conversation.gallery')
                        .exec((err, item) => {
                            if (err) {
                                console.log(err)
                            }

                            const gallery = item.conversation[item.conversation.length - 1]

                            io.emit("chat message", gallery)
                        })
                }
            }
        )
    })

    socket.on("send message", data => {
        rooms.update(
            {_id: data.roomId},
            {
                $push: {
                    conversation: {
                        from: socket.username,
                        user_name: data.user_name,
                        message: data.message,
                        favourite: false,
                        picture: data.picture,
                        roomId: data.roomId,
                        attachment: data.attachment || ''
                    }
                }
            },
            function (err) {
                if (err)
                    console.log(err)
                else {
                    const msg = {
                        from: socket.username,
                        user_name: data.user_name,
                        message: data.message,
                        favourite: false,
                        picture: data.picture,
                        avatar: data.avatar,
                        roomId: data.roomId,
                        attachment: data.attachment || ''
                    }

                    io.emit("chat message", msg)
                }
            }
        )
    });

    socket.on("recieving msgs", function (data) {
        rooms.find({_id: data}, function (err, docs) {
            socket.emit("remaining msgs", docs);
            socket.broadcast.to(socket.id).emit("Message for my own", docs);
        });
    });
    socket.on("notesadding", function (data) {
        rooms.find({_id: data.roomId}, function (err, docs) {
            socket.broadcast.to(socket.id).emit("Note for my own", docs);
        });
    });

    socket.on("pushingMsg", function (data) {
        socket.join("room", function () {
            var name = room;
            io.sockets.in(socket.rooms.room).emit("roomMsg", data);
        });
    });

    socket.on("add User to Group", function (data) {
        const ep = new EventProxy()

        ep.all('get_room', 'get_user', (room, user) => {
            socket.emit("returning participants", room)
            socket.emit("returning message group", room)
            io.emit("returning message group for target", user)
        })

        ep.on('room_update', () => {
            rooms.findOne({_id: data.roomId}, function (err, room) {
                ep.emit('get_room', room)
            });

            User.findOneAndUpdate(
                {user_id: data.user_id},
                {
                    $push: {
                        rooms: {
                            roomId: data.roomId,
                            roomName: data.roomName,
                            pic: data.pic,
                            read_notes_count: 0,
                            read_count: 0,
                            total_count: data.msgs_count,
                            total_notes_count: data.notes_count
                        }
                    }
                },
                {new: true},
                function (err, doc) {
                    if (err)
                        console.log(err);
                    ep.emit('get_user', doc)
                }
            )
        })

        rooms.update(
            {_id: data.roomId},
            {
                $push: {
                    participants: {
                        user_id: data.user_id,
                        avatar: data.avatar,
                        picture: data.picture,
                        name: data.name
                    }
                }
            },
            function (err) {
                if (err)
                    console.log(err);
                else {
                    ep.emit('room_update', true)
                }
            }
        );
    });

    socket.on("remove User from Group", function (data) {
        rooms.findOneAndUpdate(
            {_id: data.roomId},
            {$pull: {participants: {user_id: data.user_id}}
        },
            function (err, doc) {
                if (err)
                    console.log(err);
                else {
                    socket.emit("returning participants", doc);
                    socket.emit("returning message group", doc);

                    User.findOneAndUpdate(
                        {
                            user_id: data.user_id
                        },
                        {$pull: {rooms: {roomId: data.roomId}}}
                    )
                    .then(docs => {
                    })
                    .catch(err => {
                        console.log(err.stack);
                    });
                }
            }
        );
    });

    socket.on("addingnotes", function (data) {
        socket.join("room", function () {
            var name = room;
            io.sockets.in(socket.rooms.room).emit("roomNotes", data);
        });
    });
    socket.on("addnote", function (data) {
        rooms.update(
            {_id: data.roomId},
            {
                $push: {
                    notes: {
                        from: data.from,
                        text: data.text,
                        date: data.date,
                        time: data.time
                    }
                }
            },
            function (err) {
                if (err) console.log(err);
                else {
                    socket.broadcast.emit("note messagey", {
                        from: data.from,
                        text: data.text,
                        date: data.date,
                        time: data.time
                    });
                }
            }
        );
    });

    socket.on("individualnote edit", function (data) {
        rooms
            .findOneAndUpdate(
                {
                    _id: data.roomId,
                    "notes._id": data._id
                },
                {
                    $set: {
                        "notes.$.text": data.newnote
                    }
                }
            )
            .then(() => {
                rooms.find({_id: data.roomId}, function (err, docs) {
                    socket.broadcast.emit("Savenotes", docs);
                });
            })
            .catch(err => {
                console.log(rrr.stack);
            });
    });

    socket.on("retrieve favourite messages", function () {
        Gallery.find({})
            .then(docs => {
                socket.emit('favourite messages', docs)
            }).catch(err => {
                console.log(err.stack)
            })
    })

    socket.on("create group event", function (data) {
        const ep = new EventProxy()
        let _id;
        const participants = JSON.parse(data.mapping);
        const owner = participants[0]

        rooms.findOne({groupname: data.groupname}, (err, doc) => {
            if (err) {
                console.log(err)
            } else {
                if (doc) {
                    ep.emit('room_exist', true)
                } else {
                    ep.emit('room_not_exist', true)
                }
            }
        })

        ep.all('room_exist', () => {
            socket.emit("group exist", true)
        })

        ep.all('room_not_exist', () => {
            const mydata = {
                groupname: data.groupname,
                avatarletter: data.avatarletter,
                conversation: [],
                participants: JSON.parse(data.mapping),
                remainparticipants: JSON.parse(data.mapping),
                admin_id: data.id,
                created_on: data.created_on
            };
            const room = new rooms(mydata);

            room.save(function (err, docs) {
                if (err) {
                    console.log(err);
                } else {
                    _id = docs._id;
                    ep.emit('room_save', _id)
                }
            })
        })

        ep.all('room_save', _id => {
            User.findOneAndUpdate(
                {user_id: owner.user_id},
                {
                    $push: {
                        rooms: {
                            roomId: _id,
                            roomName: data.groupname,
                            pic: data.avatarletter,
                            read_notes_count: 0,
                            read_count: 0,
                            total_count: 0,
                            total_notes_count: 0
                        }
                    }
                },
                (err, user) => {
                    if (err)
                        console.log(err);
                    else {
                        ep.emit('update_user_rooms', true)
                    }
                }
            );
        })

        ep.all('update_user_rooms', () => {
            User.findOne(
                {user_id: owner.user_id},
                'rooms',
                (err, rooms) => {
                    socket.emit("refresh group list", rooms)
                }
            )
        })
    });

    socket.on("add user", function (data) {
        socket.username = data.userrealname;
        socket.picture = data.obj.picture;
        users.push({id: socket.id, username: data, pic: data.picture});
    });

    socket.on("note map", function (data) {
        rooms.findOne({_id: data}).populate('conversation.gallery').exec((err, room) => {
            if (err) {
                console.log(err);
            } else {
                socket.emit("recieving listchat rooms", room)
                socket.emit("msgs", room)
                socket.emit("dbnotes", room)
            }
        })
    });

    socket.on("HandleOpen", function (data) {
        if (data.currentFunction === "M") {
            User.findOneAndUpdate(
                {
                    user_id: data.user_id,
                    "timetable.day.id": data.id
                },
                {
                    $set: {
                        "timetable.day.$.M": data.value
                    }
                }
            )
                .then(docs => {
                    User.find({
                        user_id: data.user_id
                    }).then(docs => {
                        socket.emit("timetable", docs);
                    });
                })
                .catch(err => {
                    console.log(err.stack);
                });
        } else if (data.currentFunction === "T") {
            User.findOneAndUpdate(
                {
                    user_id: data.user_id,
                    "timetable.day.id": data.id
                },
                {
                    $set: {
                        "timetable.day.$.T": data.value
                    }
                }
            )
                .then(docs => {
                    User.find({
                        user_id: data.user_id
                    }).then(docs => {
                        User.find({
                            user_id: data.user_id
                        }).then(docs => {
                            socket.emit("timetable", docs);
                        });
                    });
                })
                .catch(err => {
                    console.log(err.stack);
                });
        } else if (data.currentFunction == "W") {
            User.findOneAndUpdate(
                {
                    user_id: data.user_id,
                    "timetable.day.id": data.id
                },
                {
                    $set: {
                        "timetable.day.$.W": data.value
                    }
                }
            )
                .then(docs => {
                    User.find({
                        user_id: data.user_id
                    }).then(docs => {
                        socket.emit("timetable", docs);
                    });
                })
                .catch(err => {
                    console.log(err.stack);
                });
        } else if (data.currentFunction == "Th") {
            User.findOneAndUpdate(
                {
                    user_id: data.user_id,
                    "timetable.day.id": data.id
                },
                {
                    $set: {
                        "timetable.day.$.Th": data.value
                    }
                }
            )
                .then(docs => {
                    User.find({
                        user_id: data.user_id
                    }).then(docs => {
                        socket.emit("timetable", docs);
                    });
                })
                .catch(err => {
                    console.log(err.stack);
                });
        } else if (data.currentFunction == "F") {
            User.findOneAndUpdate(
                {
                    user_id: data.user_id,
                    "timetable.day.id": data.id
                },
                {
                    $set: {
                        "timetable.day.$.F": data.value
                    }
                }
            )
                .then(docs => {
                    User.find({
                        user_id: data.user_id
                    }).then(docs => {
                        socket.emit("timetable", docs);
                    });
                })
                .catch(err => {
                    console.log(err.stack);
                });
        } else if (data.currentFunction == "S") {
            User.findOneAndUpdate(
                {
                    user_id: data.user_id,
                    "timetable.day.id": data.id
                },
                {
                    $set: {
                        "timetable.day.$.S": data.value
                    }
                }
            )
                .then(docs => {
                    User.find({
                        user_id: data.user_id
                    }).then(docs => {
                        socket.emit("timetable", docs);
                    });
                })
                .catch(err => {
                    console.log(err.stack);
                });
        } else if (data.currentFunction == "Su") {
            User.findOneAndUpdate(
                {
                    user_id: data.user_id,
                    "timetable.day.id": data.id
                },
                {
                    $set: {
                        "timetable.day.$.Su": data.value
                    }
                }
            )
                .then(docs => {
                    User.find({
                        user_id: data.user_id
                    }).then(docs => {
                        socket.emit("timetable", docs);
                    });
                })
                .catch(err => {
                    console.log(err.stack);
                });
        }
    });

    socket.on("createpnotes", function (data) {
        User.update(
            {_id: data.id},
            {
                $push: {
                    privatenotes: {
                        title: data.title,
                        desc: data.desc,
                        notes: []
                    }
                }
            },
            function (err) {
                if (err) console.log(err);
                else {
                }
            }
        );
    });
    socket.on("gettingpnotes", function (data) {
        User.find({_id: data}, function (err, notes) {
            if (err) {
                console.log(err);
            } else {
                socket.emit("addingpnotes", notes[0].privatenotes);
            }
        });
    });
    socket.on("addingprivatenotes", function (data) {
        User.update(
            {_id: data.id, "privatenotes._id": data.folder},
            {
                $push: {
                    "privatenotes.$.notes": data.data
                }
            },
            function (err, docs) {
                if (err) console.log(err);
                else {
                    User.find({_id: data.id}, function (err, _user) {
                        if (err) {
                            console.log(err);
                        } else {
                            socket.emit("refreshprinotes", _user);
                        }
                    });
                }
            }
        );
    });

    socket.on("retrieve msgs", function (data) {
        rooms.findOne({_id: data.roomId}).populate('conversation.gallery').exec((err, room) => {
            if (err) {
            } else {
                socket.emit("chat msgs", room);
            }
        })
    });

    socket.on('search users', (data) => {
        User.find(
            {email: data},
            (err, docs) => {
                socket.emit('find users', docs);
            }
        );
    })

    socket.on('Leave room session', data => {
        const ep = new EventProxy()
        User.findOneAndUpdate(
            {
                user_id: data.user_id,
                "rooms.roomId": data.room_id
            },
            {
                $set: {
                    "rooms.$.leave_time": Date.now()
                }
            }
        )
        .then(docs => {
        })
        .catch(err => {
            console.log(err.stack);
        });
    })

    socket.on('assign administrator', data => {
        rooms.findOneAndUpdate(
            {_id: data.roomId, "participants.user_id": data.user_id},
            {
                $set: {
                    "participants.$.role": data.role
                }
            },
            {new: true}
        ).then(doc => {
            socket.emit("returning participants", doc)
        }).catch(err => {
            console.log(err.stack)
        })
    })

    socket.on('change gallery title', data => {
        const {_id, title} = data
        Gallery.findOneAndUpdate(
            {_id: _id},
            {
                $set: {
                    title: title
                }
            },
            {new: true}
        ).then(doc => {
            socket.emit("update gallery", doc)
        }).catch(err => {
            console.log(err.stack)
        })
    })
})

