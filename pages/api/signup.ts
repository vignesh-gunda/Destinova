import { addUser } from "../../utils/users";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    const user = await addUser(email, password);
    if (user) return res.status(201).json(user);
    return res.status(409).json({ message: "User already exists" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}