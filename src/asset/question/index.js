
import generic from "./generic.json";
import data from "./data.json";
import area from "./area/area.json";
import tickets from "./area/tickets.json";
import company from "./area/company/company.json";


export const questions = [generic, area, company];
export { generic, area, company };

export const questionsElement = questions.reduce((prev, curr) => ({ ...prev, [curr.name]: -1 }), {});