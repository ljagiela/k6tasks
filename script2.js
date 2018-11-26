import {check, sleep} from "k6";
import http from "k6/http";
import {parseHTML} from "k6/html";
import {Counter} from "k6/metrics";

let userCounter = new Counter("counter_user");
let adminCounter = new Counter("counter_admin");

const TESTED_URL = "http://test.loadimpact.com/my_messages.php";

export let options = {
    vus: 10,
    iterations: 100
};

const testUsers = [
    {login: "test_user", password: "1234"},
    {login: "admin", password: "123"}
];

const getRandomUser = function (users) {
    return users[Math.floor(Math.random() * users.length)];
};

export default function () {
    let res = http.get(TESTED_URL);
    const randomUser = getRandomUser(testUsers);

    if (randomUser.login.includes("admin")) adminCounter.add(1);
    else userCounter.add(1);

    res = res.submitForm({
        fields: randomUser,
        submitSelector: "[type='submit']",
    });

    const body = parseHTML(res.body);
    const messages = body.find('table tr');

    console.log("Messages for user: " + randomUser.login);
    messages.map(function (index, message) {
        if (index > 1) console.log(message.text().replace(/[\r\n]/g, ''));
    });
    console.log("--------------");

    check(res, {
        "is status 200": (r) => r.status === 200
    });
};
