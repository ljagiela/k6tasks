import {check, sleep} from "k6";
import http from "k6/http";
import {parseHTML} from "k6/html";
import {Counter} from "k6/metrics";

let wonCounter = new Counter("won_counter");

const TESTED_URL = "http://test.loadimpact.com/flip_coin.php?bet=tails";

export let options = {
    vus: 10,
    iterations: 100
};

export default function () {
    const res = http.get(TESTED_URL);
    const body = parseHTML(res.body);
    const tossResult = body.find('body h2').text();
    if (tossResult.includes('won')) wonCounter.add(1);

    check(res, {
        "is status 200": (r) => r.status === 200
    });
};
