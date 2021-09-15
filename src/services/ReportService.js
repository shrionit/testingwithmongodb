import Report, {
  ReportDetailSchema as reportDetailSchema,
} from "../models/Report.js";
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
      out = rep.result ? this._genReportView(rep.result) : {};
    } else {
      out = { status: "ERROR", details: rep.result };
    }

    return out;
  }

  static async create(req) {
    let out = {};
    if (!req.body.reportDetails) return out;
    // get purged data
    let purgedData = Helper.getPurgedData(
      reportDetailSchema.obj,
      req.body.reportDetails
    );

    //check if marketID and cmdtyID combo exists
    let res = await Helper.handle(
      async () =>
        await Report.findOne({
          "reportDetails.marketID": purgedData.marketID,
          "reportDetails.cmdtyID": purgedData.cmdtyID,
        })
    );

    if (res.status === "SUCCESS") {
      const alreadyExistingReport = res.result;
      let report = alreadyExistingReport
        ? new Report(alreadyExistingReport)
        : new Report();

      // then generate report
      report = this._genReport(report, purgedData);
      const saved = await Helper.handle(async () => await report.save());

      // then generate response
      out = this._genResponseForPOST(out, saved);
    } else {
      out = { status: "ERROR", details: res.result };
    }

    return out;
  }

  static async update(req) {}

  static async delete(req) {}

  static _genReport(report, reportDetail) {
    // add unique users
    if (report.users.indexOf(reportDetail.userID) == -1) {
      report.users.push(reportDetail.userID);
    }

    // add reportdetail to reportDetails list
    report.reportDetails.push(reportDetail);

    // calculate unit price avg
    let unitPrices = [];
    report.reportDetails.forEach((rd) =>
      unitPrices.push(Math.round(rd.price / (rd.convFctr || 1)))
    );
    report.price = parseFloat(
      (unitPrices.reduce((a, b) => a + b) / unitPrices.length).toFixed(2)
    );

    // add timestamp (last updated timestamp)
    report.timestamp = Date.now();

    return report;
  }

  static _genReportView(report) {
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
}
