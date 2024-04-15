import type IGuests from "./IGuests";

export default interface IEvent{
    id: string,
    title: string;
    date: string;
    hour: string;
    guests: IGuests[];
    description: string;
    userId: string
}
