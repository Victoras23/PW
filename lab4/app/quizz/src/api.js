const userHost = "https://late-glitter-4431.fly.dev/api/v54";
const developerHost = "https://late-glitter-4431.fly.dev/api/developers/v72/";

export const api = {
	GetDeveloperKey     : () => `${developerHost}/developer_keys`,
    GetDeveloperToken   : () => `${developerHost}/tokens`,
	users: {
        UsersCreate     : () => `${userHost}/users`,  // method POST
        UsersShow       : () => `${userHost}/users`,  // method GET
        UsersDelete     : () => `${userHost}/users/`, // method DELETE
	},
    quizzes: {
        ShowQuizz       : () => `${userHost}/quizzes/`, // {{quiz-id}} method GET
        CreateQuizz     : () => `${userHost}/quizzes`, // method POST 
        DeleteQuizz     : () => `${userHost}/quizzes/`, // {{quiz-id}} method DELETE
        ShowQuizzes     : () => `${userHost}/quizzes`, // method GET
        SublitResponse  : () => `${userHost}/quizzes/`, // {{quiz-id}}/submit  method POST
    }
}