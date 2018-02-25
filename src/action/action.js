import ActionPage from "../lib/ActionPage";

const seconds = document.getElementById('seconds');
const start = document.getElementById('start');

const actionPage = new ActionPage();
actionPage.register(seconds, start);
