import pkg from "bcryptjs";
import { transporter } from "../../config";
import Handlebars from "handlebars";
import * as jwt from "jsonwebtoken";
import {User} from "../../lib/models/users";


export const postRegistrationHandler = async (request, reply) => {
    const { hash } = pkg;
    const { sign } = jwt.default;
    const { name, email, password } = request.body;

    const existingEmail = await User.findOne({ email });
    const existingName = await User.findOne({ name });

    if (existingName) {
        return reply.status(400).send({
            error: "User with this name already exists",
            field: "name",
        });
    }
    if (existingEmail) {
        return reply.status(400).send({
            error: "User with this email already exists",
            field: "email",
        });
    }
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(password)) {
        return reply.status(400).send({
            error:
                "Password must contain at least one lowercase letter, one uppercase letter, one number and must be at least 8 characters long",
            field: "password",
        });
    }

    const hashedPassword = await hash(password, 10);

    const token = await sign({ email }, process.env.SECRET_WORD, {
        expiresIn: "15m",
    });

    const source = `<a href="{{url}}">Click to confirm</a>`;
    const template = Handlebars.compile(source);

    try {
        const data = { url: `http://localhost:3000/api/email/?confirm=${token}` };
        const html = template(data);

        await transporter.sendMail({
            from: "noreply-authtodomail@gmail.com",
            to: email,
            subject: "Todo registration",
            html: html,
        });
    } catch (err) {
        reply.send({ error: err.message });
    }

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        confirmationCode: token,
    });

    await newUser.save();
    return reply.status(201).send({ message: "User successful created" });
};
