export class Streak{
    streak_length: number | undefined;
    streak_start: number | undefined;
    streak_end: number | undefined;
}

export class InformacoesUsuario{
    streak_semanal: Streak | undefined;
    streak_diario: Streak | undefined;
    peso: number | undefined;
    altura: number | undefined
}