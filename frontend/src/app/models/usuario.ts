import { Persona } from './persona';

export interface Usuario {

    id: number;
    
    username: string

    password:string

    rol:string

    email: string

    persona: Persona

    token: string;
}