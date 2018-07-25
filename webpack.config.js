const webpack = require("webpack");
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let config = {
    entry: [
        "./app/app.jsx",
        "./app/styles/index.scss"
    ],
    plugins: [
        new ExtractTextPlugin({
            filename:'style.css',
            allChunks: true
        }),
    ],
    output: {path: __dirname + '/public', filename: 'bundle.js'},
    resolve: {
        alias: {
            Main: path.resolve(__dirname, "app/components/main.jsx"),
            MainContainer: path.resolve(__dirname, "app/components/MainContainer.jsx"),
            UIstore: path.resolve(__dirname, "app/components/UIstore.jsx"),
            FirstPage: path.resolve(__dirname, "app/components/firstpage.jsx"),
            Homepage: path.resolve(__dirname, "app/components/homepage.jsx"),
            ListChatContainer: path.resolve(__dirname, "app/components/chat/ListChatContainer.jsx"),
            LoginDialog: path.resolve(__dirname, "app/components/loginmodal.jsx"),
            SignupDialog: path.resolve(__dirname, "app/components/signupmodal.jsx"),
            Toolbar: path.resolve(__dirname, "app/components/toolbar.jsx"),
            Nav: path.resolve(__dirname, "app/components/nav.jsx"),
            DrawerOpenRightExample: path.resolve(__dirname, "app/components/drawer.jsx"),
            NewChatDrawer: path.resolve(__dirname, "app/components/drawer/newchatdrawer.jsx"),
            NotFound: path.resolve(__dirname, "app/components/dashboard/NotFound.jsx"),
            Profile: path.resolve(__dirname, "app/components/dashboard/profile.jsx"),
            Settings: path.resolve(__dirname, "app/components/dashboard/settings.jsx"),
            Invites: path.resolve(__dirname, "app/components/dashboard/invites.jsx"),
            FindFriends: path.resolve(__dirname, "app/components/dashboard/FindFriends.jsx"),
            PrivateNotes: path.resolve(__dirname, "app/components/dashboard/privatenotes.jsx"),
            FriendList: path.resolve(__dirname, "app/components/dashboard/FriendList.jsx"),
            AcceptRequests: path.resolve(__dirname, "app/components/dashboard/AcceptRequests.jsx"),
            Board: path.resolve(__dirname, "app/components/board.jsx"),
            Boards: path.resolve(__dirname, "app/components/Note.jsx"),
            Chatbar: path.resolve(__dirname, "app/components/toolbars/chattoolbar.jsx"),
            Msgbar: path.resolve(__dirname, "app/components/toolbars/msgtoolbar.jsx"),
            TimeTable: path.resolve(__dirname, "app/components/dashboard/timetable.jsx"),
            Events: path.resolve(__dirname, "app/components/dashboard/events.jsx"),
            Lock: "public/assets/js/lock.min.js",
            Boardbar: path.resolve(__dirname, "app/components/toolbars/boardtoolbar.jsx"),
            Verify: path.resolve(__dirname, "app/components/authentication/verify.jsx"),
            appStyles: path.resolve(__dirname, "app/styles/index.scss"),
            applicationStyles: path.resolve(__dirname, "app/styles/app.scss"),
            HomepageStyles: path.resolve(__dirname, "app/styles/homepage.scss"),
            noteStyle: path.resolve(__dirname, "app/styles/notestyle.scss"),
            snowStyle: path.resolve(__dirname, "app/styles/quill.snow.scss"),
            coreStyle: path.resolve(__dirname, "app/styles/quill.core.scss"),
            bubbleStyle: path.resolve(__dirname, "app/styles/quill.bubble.css")
        },
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    plugins: [ 'transform-decorators-legacy', "transform-class-properties" ],
                    presets: ['react', 'es2015', 'stage-0'],
                }
            },
            {
                test: /\.(scss|css)$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader']),
            }

        ],
    },
    devtool: "cheap-module-eval-source-map"
};

module.exports = config;