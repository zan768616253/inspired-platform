import {observable, autorun } from "mobx";

class UserStore {
  @observable obj = {};
  @observable userrealname = "";
  @observable useraccount = "";
  @observable created_at = "";
  @observable created_at_day = "";
  @observable avatar = "";
  @observable phone = "";
  @observable children_number = 1;
  @observable hometown = "";
  @observable expertise = "";
  @observable culture = "";
  @observable belief = "";
  @observable bio = "";
  @observable desc = "";
  @observable emailverified = false;
  @observable allUsers = [];
  @observable listy = false;
  @observable emailnotif = true;
  @observable flisty = false;
  @observable groupName;
  @observable currentFunction;
  @observable currentId;
  @observable currentValue;
  @observable role;
}

const userstore = (window.userstore = new UserStore());

export default userstore;

autorun(() => {
})
