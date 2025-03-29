/* DO NOT EDIT, file generated by nestjs-i18n */

/* eslint-disable */
/* prettier-ignore */
import { Path } from "nestjs-i18n";
/* prettier-ignore */
export type I18nTranslations = {
    "exception": {
        "admin": {
            "alreadyRegisteredCreate": string;
            "alreadyRegisteredUpdate": string;
            "failedCreate": string;
            "failedRemove": string;
            "failedRemoveNotFound": string;
            "failedUpdate": string;
            "notFound": string;
            "notFoundPlural": string;
        };
        "appointments": {
            "errorApposCount": string;
            "errorApposSearch": string;
            "errorApposStatistics": string;
            "errorAttendance": string;
            "errorDaysWithAppos": string;
            "errorYearsWithAppos": string;
            "failedCreate": string;
            "failedRemove": string;
            "failedUpdate": string;
            "notFound": string;
            "notFoundByProfessional": string;
            "notFoundByProfessionalAndYear": string;
            "notFoundByYear": string;
            "notFoundPlural": string;
            "notFoundPluralFilterNone": string;
            "notFoundUniqueProfessionals": string;
        };
        "auth": {
            "failedRefreshToken": string;
            "failedTokens": string;
            "login": string;
            "notFound": string;
            "unauthorized": {
                "notValidated": string;
                "refreshToken": string;
            };
        };
        "common": {
            "invalidId": string;
            "invalidSearchType": string;
        };
    };
    "response": {
        "admin": {
            "created": string;
            "found": string;
            "foundPlural": string;
            "removed": string;
            "updated": string;
        };
        "appointments": {
            "apposCount": string;
            "attendance": string;
            "created": string;
            "daysWithAppos": string;
            "emptyApposSearch": string;
            "emptyByUserAndProfessional": string;
            "emptyByUserAndYear": string;
            "emptyByUserProfessionalAndYear": string;
            "emptyDatabase": string;
            "emptyDaysWithAppos": string;
            "emptyFoundPluralFilterNone": string;
            "emptyUniqueProfessionals": string;
            "emptyYearsWithAppos": string;
            "found": string;
            "foundApposStatistics": string;
            "foundByUser": string;
            "foundByUserAndProfessional": string;
            "foundByUserAndYear": string;
            "foundByUserProfessionalAndYear": string;
            "foundPlural": string;
            "foundUniqueProfessionals": string;
            "foundYearsWithAppos": string;
            "removed": string;
            "updated": string;
        };
        "auth": {
            "admin": string;
            "login": string;
            "logout": string;
            "refreshTokens": string;
        };
    };
    "validation": {
        "admin": {
            "firstName": {
                "isString": string;
                "minLength": string;
                "maxLength": string;
            };
            "lastName": {
                "isString": string;
                "minLength": string;
                "maxLength": string;
            };
            "email": {
                "required": string;
                "invalid": string;
            };
            "password": {
                "isString": string;
                "minLength": string;
                "maxLength": string;
            };
            "role": string;
            "refreshToken": {
                "isString": string;
            };
        };
        "appointments": {
            "day": {
                "isNotEmpty": string;
                "isString": string;
            };
            "hour": {
                "isNotEmpty": string;
                "isString": string;
            };
            "professional": {
                "isNotEmpty": string;
                "isString": string;
            };
            "slot": {
                "isInt": string;
            };
            "status": {
                "isString": string;
            };
            "user": {
                "isNotEmpty": string;
                "isString": string;
            };
        };
    };
};
/* prettier-ignore */
export type I18nPath = Path<I18nTranslations>;
