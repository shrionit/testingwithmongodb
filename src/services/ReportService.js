import Report from "../models/Report.js";
import UserReportService from "../services/UserReportService.js";

import Helper from "../utils/Helper.js";

export default class ReportService {
  static async get(req) {
    let out = {};
    if (!req.query.reportID) {
      let res = await Helper.handle(async () => await Report.find());
      return res.result;
    }

    const rep = await Helper.handle(
      async () => await Report.findById(req.query.reportID)
    );

    if (rep.status === "SUCCESS") {
      out = (await rep.result) ? await this._genReportView(rep.result) : {};
    } else {
      out = { status: "ERROR", details: rep.result };
    }

    return out;
  }

  static async create(req) {
    let out = {};
    if (!req.body.reportDetails) return out;

    const userReportRes = await Helper.handle(
      async () => await UserReportService.create(req)
    );
    let userReport = null;
    if (userReportRes.status === "SUCCESS") {
      userReport = userReportRes.result.result;
    }

    // check if marketID and cmdtyID combo exists
    let res = await this._findReportByMrktIdAndCmdtId({
      marketID: userReport.marketID,
      cmdtyID: userReport.cmdtyID,
    });

    if (res.status === "SUCCESS") {
      const alreadyExistingReport = res.result;
      let report = alreadyExistingReport
        ? new Report(alreadyExistingReport)
        : new Report();

      // then generate report
      report = await this._genReport(report, userReport);
      const saved = await Helper.handle(async () => await report.save());
      // then generate response
      out = this._genResponseForPOST(out, saved);
    } else {
      if (userReport) {
        await UserReportService.delete(userReport._id);
      }
      out = { status: "ERROR", details: res.result };
    }

    return out;
  }

  static async update(req) {}

  static async delete(req) {}

  static async _genReport(report, reportDetail) {
    // add unique users
    if (report.users.indexOf(reportDetail.userID) == -1) {
      report.users.push(reportDetail.userID);
    }

    // add reportdetail to reportDetails list
    report.reportDetails.push(reportDetail);
    // calculate unit price avg
    let unitPrices = [];
    let rp = await report.populate("reportDetails");
    rp.reportDetails.forEach((rd) =>
      unitPrices.push(Math.round(rd.price / (rd.convFctr || 1)))
    );
    report.price = parseFloat(
      (unitPrices.reduce((a, b) => a + b) / unitPrices.length).toFixed(2)
    );

    // add timestamp (last updated timestamp)
    report.timestamp = Date.now();

    return report;
  }

  static async _genReportView(report) {
    report = await Report.findOne({ _id: report.id }).populate("reportDetails");
    // map report fields to view field and return
    return {
      _id: report._id,
      cmdtyName: report.reportDetails[0].cmdtyName,
      cmdtyID: report.reportDetails[0].cmdtyID,
      marketID: report.reportDetails[0].marketID,
      marketName: report.reportDetails[0].marketName,
      users: report.users,
      timestamp: report.timestamp,
      priceUnit: report.priceUnit,
      price: report.price,
    };
  }

  static _genResponseForPOST(out, res) {
    if (res.status === "SUCCESS") {
      out = { status: "SUCCESS", reportID: res.result._id };
    } else {
      out = { status: "ERROR", details: res.result };
    }
    return out;
  }

  static async _findReportByMrktIdAndCmdtId(obj) {
    let res = await Report.find({}).populate("reportDetails");
    res = res.filter(
      (rp) =>
        rp.reportDetails[0].marketID === obj.marketID &&
        rp.reportDetails[0].cmdtyID === obj.cmdtyID
    );
    res = res.length !== 0 ? res[0] : null;
    if (res) {
      res = await Report.findById(res._id);
    }
    return { status: "SUCCESS", result: res };
  }
}
