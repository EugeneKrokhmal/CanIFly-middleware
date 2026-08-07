import { z } from "zod";
export declare const weightClassSchema: z.ZodEnum<{
    c0: "c0";
    c1: "c1";
    c2: "c2";
}>;
export declare const appLocaleSchema: z.ZodEnum<{
    es: "es";
    en: "en";
    de: "de";
    fr: "fr";
    pl: "pl";
    cs: "cs";
}>;
export declare const authCredentialsSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const authRegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    operatorNumber: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    locale: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        es: "es";
        en: "en";
        de: "de";
        fr: "fr";
        pl: "pl";
        cs: "cs";
    }>>>;
    marketingOptIn: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    acceptTerms: z.ZodLiteral<true>;
}, z.core.$strip>;
export declare const updateMarketingOptInSchema: z.ZodObject<{
    marketingOptIn: z.ZodBoolean;
}, z.core.$strip>;
export declare const contactFormSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    category: z.ZodDefault<z.ZodEnum<{
        suggestion: "suggestion";
        complaint: "complaint";
        other: "other";
    }>>;
    message: z.ZodString;
    website: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    locale: z.ZodOptional<z.ZodEnum<{
        es: "es";
        en: "en";
        de: "de";
        fr: "fr";
        pl: "pl";
        cs: "cs";
    }>>;
}, z.core.$strip>;
export declare const authEmailSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export declare const authVerifyTokenSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>;
export declare const authResetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const updateLocaleSchema: z.ZodObject<{
    locale: z.ZodEnum<{
        es: "es";
        en: "en";
        de: "de";
        fr: "fr";
        pl: "pl";
        cs: "cs";
    }>;
}, z.core.$strip>;
export declare const updateAccountSchema: z.ZodObject<{
    name: z.ZodString;
    bio: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    operatorNumber: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    removeAvatar: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"true">, z.ZodLiteral<"false">, z.ZodNull]>>, z.ZodTransform<boolean, boolean | "true" | "false" | null | undefined>>;
}, z.core.$strip>;
export declare const pinKindSchema: z.ZodEnum<{
    obstacle: "obstacle";
    fly_spot: "fly_spot";
}>;
export declare const obstacleTypeSchema: z.ZodEnum<{
    other: "other";
    construction: "construction";
    crane: "crane";
    electric_line: "electric_line";
    air_sports: "air_sports";
    park: "park";
    rooftop: "rooftop";
    field: "field";
    beach: "beach";
}>;
export declare const obstacleVoteSchema: z.ZodObject<{
    value: z.ZodNullable<z.ZodEnum<{
        up: "up";
        down: "down";
    }>>;
}, z.core.$strip>;
export declare const createObstacleSchema: z.ZodObject<{
    kind: z.ZodDefault<z.ZodEnum<{
        obstacle: "obstacle";
        fly_spot: "fly_spot";
    }>>;
    type: z.ZodEnum<{
        other: "other";
        construction: "construction";
        crane: "crane";
        electric_line: "electric_line";
        air_sports: "air_sports";
        park: "park";
        rooftop: "rooftop";
        field: "field";
        beach: "beach";
    }>;
    lat: z.ZodNumber;
    lng: z.ZodNumber;
    heightM: z.ZodNumber;
    message: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const bboxObstaclesQuerySchema: z.ZodObject<{
    west: z.ZodCoercedNumber<unknown>;
    south: z.ZodCoercedNumber<unknown>;
    east: z.ZodCoercedNumber<unknown>;
    north: z.ZodCoercedNumber<unknown>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    kind: z.ZodOptional<z.ZodEnum<{
        obstacle: "obstacle";
        fly_spot: "fly_spot";
    }>>;
}, z.core.$strip>;
export declare const droneProfileQuerySchema: z.ZodObject<{
    altitudeAgl: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    weightClass: z.ZodDefault<z.ZodEnum<{
        c0: "c0";
        c1: "c1";
        c2: "c2";
    }>>;
    operationCategory: z.ZodDefault<z.ZodEnum<{
        open: "open";
        specific: "specific";
    }>>;
}, z.core.$strip>;
export declare const pointStatusQuerySchema: z.ZodObject<{
    altitudeAgl: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    weightClass: z.ZodDefault<z.ZodEnum<{
        c0: "c0";
        c1: "c1";
        c2: "c2";
    }>>;
    operationCategory: z.ZodDefault<z.ZodEnum<{
        open: "open";
        specific: "specific";
    }>>;
    lat: z.ZodCoercedNumber<unknown>;
    lng: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const bboxZonesQuerySchema: z.ZodObject<{
    altitudeAgl: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    weightClass: z.ZodDefault<z.ZodEnum<{
        c0: "c0";
        c1: "c1";
        c2: "c2";
    }>>;
    operationCategory: z.ZodDefault<z.ZodEnum<{
        open: "open";
        specific: "specific";
    }>>;
    west: z.ZodCoercedNumber<unknown>;
    south: z.ZodCoercedNumber<unknown>;
    east: z.ZodCoercedNumber<unknown>;
    north: z.ZodCoercedNumber<unknown>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare function openCategoryCeiling(altitudeAgl: number): number;
