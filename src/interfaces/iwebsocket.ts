import { Observable } from "rxjs";

export default interface IWebSocket {
   sendMessage(message: string): void
}