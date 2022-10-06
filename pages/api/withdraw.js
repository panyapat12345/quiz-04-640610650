import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";

export default function withdrawRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    const user = checkToken(req);
    if (user === null || user.isAdmin) {
      return res
        .status(403)
        .json({ ok: false, message: "You do not have permission to withdraw" });
    }

    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    //check if amount < 1
    if (amount < 1) {
      return res
        .status(400)
        .json({ ok: false, message: "Amount must be greater than 0" });
    }

    //find and update money in DB (if user has enough money)
    const users = readUsersDB();
    const idx = users.findIndex((x) => x.username === user.username);
    if (users[idx].money < amount) {
      return res
        .status(400)
        .json({ ok: false, message: "You do not has enough money" });
    } else {
      //return response
      users[idx].money -= amount;
      writeUsersDB(users);
      return res.json({ ok: true, money: users[idx].money });
    }
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
