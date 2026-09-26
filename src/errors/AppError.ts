export default class AppError extends Error{
    constructor(public statusCode:number, public message: string){
        super(message);
    }
}