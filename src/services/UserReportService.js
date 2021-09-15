import UserReport from "../models/UserReport.js";
import Report, {
  UserReportSchema as userReportSchema,
} from "../models/UserReport.js";
import Helper from "../utils/Helper.js";

export default class ReportService {
  static async get(req) {
    let out = {};
    if (!req.query.userID) {
      let res = await Helper.handle(async () => await UserReport.find());
      return res.result;
    }

    const rep = await Helper.handle(
      async () => await UserReport.find({ userID: req.query.userID })
    );

    if (rep.status === "SUCCESS") {
      out = rep.result || [];
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
      userReportSchema.obj,
      req.body.reportDetails
    );

    let userReport = new UserReport(purgedData);
    const res = await Helper.handle(async () => await userReport.save());
    out = res;
    if (out.status === "SUCCESS") {
      out.result = userReport;
    } else {
      out = res;
    }

    return out;
  }

  static async update(req) {}

  static async delete(id) {
    const res = await Helper.handle(
      async () => await UserReport.deleteOne({ _id: id })
    );
  }
}
