
import area from "@asset/question/area/area.json";
import area from "@asset/question/area/tickets.json";
import area from "@asset/question/area/company/company.json";
import generic from "@asset/question/generic.json";
import data from "@asset/question/data.json";


export const Form = [...Object.values(generic), ...data, ...area];
