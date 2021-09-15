import supertest from "supertest";
import { expect } from "chai";
import "../src/server.js";
const server = supertest.agent("http://localhost:8080");

let reportID = null;

const data1 = {
  reportDetails: {
    userID: "user-1",
    marketID: "market-1",
    marketName: "Vashi Navi Mumbai",
    cmdtyID: "cmdty-1",
    cmdtyName: "Potato",
    priceUnit: "Pack",
    convFctr: 50,
    price: 700,
  },
};

const data2 = {
  reportDetails: {
    userID: "user-2",
    marketID: "market-1",
    marketName: "Vashi Navi Mumbai",
    cmdtyID: "cmdty-1",
    cmdtyName: "Potato",
    priceUnit: "Quintal",
    convFctr: 100,
    price: 1600,
  },
};

describe("REPORT", () => {
  it("First ==> POST /reports", (done) => {
    server
      .post("/api/v1/reports")
      .send(data1)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (err, res) {
        reportID = res.body.reportID;
        console.log(res.body);
        done();
      });
  });

  it("Second ==> POST /reports", (done) => {
    server
      .post("/api/v1/reports")
      .send(data2)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (err, res) {
        reportID = res.body.reportID;
        console.log(res.body);

        done();
      });
  });
  it("REPORTVIEW ==> GET /reports", function (done) {
    server
      .get("/api/v1/reports?reportID=" + reportID)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (err, res) {
        console.log(res.body);
        done();
      });
  });
});
