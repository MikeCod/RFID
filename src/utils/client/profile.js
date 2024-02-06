import { createContext } from 'react';
import * as Form from "@asset/question";


export const Profile = createContext(null);
export const Answers = createContext(Form.questions.reduce((prev, curr) => ({ ...prev, [curr.name]: -1 }), {}));
export const Filled = createContext(0);
