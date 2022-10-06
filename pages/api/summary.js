import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    if (user === null || !user.isAdmin) {
      return res.status(403).json({ ok: false, message: "Permission denied" });
    }

    //compute DB summary
    const users = readUsersDB();
    const userCount = users.reduce((p, c) => (!c.isAdmin ? p + 1 : p), 0);
    const adminCount = users.reduce((p, c) => (c.isAdmin ? p + 1 : p), 0);
    const totalMoney = users.reduce(
      (p, c) => (!c.isAdmin ? p + c.money : p),
      0
    );

    //return response
    return res.json({ ok: true, userCount, adminCount, totalMoney });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
