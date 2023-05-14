import * as jwt from 'jsonwebtoken';
import pkg from "bcryptjs";
import {User} from "../../lib/models/users"

export const loginHandler = async (request, reply) => {

    const { compare } = pkg;
    const { sign } = jwt;

    const { email, password } = request.body;

    const user = await User.findOne({ email });

    if (!user) {
        return reply.status(401).send({ error: "Wrong email or password" });
    } else {
        const isPasswordCorrect = await compare(password, user.password);

        if (isPasswordCorrect) {
            if (!user.isconfirmed) {
                return reply.status(401).send({
                    error: "Please activate you're account",
                    confirmed: user.isconfirmed,
                });
            } else {
                const token = await sign(
                    { email: user.email, id: user.id },
                    process.env.SECRET_WORD,
                    {
                        expiresIn: "24h",
                    }
                );
                return reply.status(200).send({
                    id: user.id,
                    message: `Welcome ${user.name}`,
                    confirmed: user.isconfirmed,
                    token,
                });
                // .setCookie("my-cookie", "cookie-value", {
                //   path: "/",
                //   // httpOnly: true,
                //   // secure: true,
                //   // sameSite: 'strict',
                //   maxAge: 60 * 60 * 24,
                // });
            }
        }
    }

    return reply.status(401).send({ error: "Wrong email or password" });
};
