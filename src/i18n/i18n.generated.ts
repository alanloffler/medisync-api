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
            "emptyApposSearch": string;
            "emptyByUserAndProfessional": string;
            "emptyByUserAndYear": string;
            "emptyByUserProfessionalAndYear": string;
            "emptyDatabase": string;
            "emptyDaysWithAppos": string;
            "emptyFoundPluralFilterNone": string;
            "emptyUniqueProfessionals": string;
            "emptyYearsWithAppos": string;
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
        "areas": {
            "duplicated": string;
            "emptyPlural": string;
            "failedCreate": string;
            "failedRemove": string;
            "failedUpdate": string;
            "notFound": string;
            "notFoundPlural": string;
        };
        "auth": {
            "failedRefreshToken": string;
            "failedTokens": string;
            "forbidden": string;
            "login": string;
            "notFound": string;
            "refreshTokenRequired": string;
            "unauthorized": {
                "notAdmin": string;
                "notValidated": string;
                "payload": string;
                "refreshToken": string;
                "requiredToken": string;
            };
        };
        "common": {
            "invalidId": string;
            "invalidSearchType": string;
        };
        "dashboard": {
            "emptyDaysCount": string;
            "emptyLatestAppos": string;
            "emptyLatestUsers": string;
            "errorApposCount": string;
            "errorLatestAppos": string;
            "errorLatestApposCount": string;
            "errorLatestProfessionalsCount": string;
            "errorLatestUsers": string;
            "errorLatestUsersCount": string;
            "errorProfessionalsCount": string;
            "errorUsersCount": string;
            "notFoundDaysCount": string;
        };
        "email": {
            "notSent": string;
        };
        "specializations": {
            "emptyPlural": string;
            "failedCreate": string;
            "failedRemove": string;
            "failedUpdate": string;
            "notFound": string;
            "notFoundPlural": string;
        };
        "statistics": {
            "processingError": string;
        };
        "titles": {
            "emptyPlural": string;
            "failedCreate": string;
            "failedRemove": string;
            "failedUpdate": string;
            "notFound": string;
            "notFoundPlural": string;
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
        "areas": {
            "created": string;
            "found": string;
            "foundPlural": string;
            "removed": string;
            "updated": string;
        };
        "auth": {
            "admin": string;
            "login": string;
            "logout": string;
            "refreshTokens": string;
        };
        "dashboard": {
            "apposCount": string;
            "foundDaysCount": string;
            "latestAppos": string;
            "latestApposCount": string;
            "latestProfessionalsCount": string;
            "latestUsers": string;
            "latestUsersCount": string;
            "professionalsCount": string;
            "usersCount": string;
        };
        "email": {
            "sent": string;
        };
        "specializations": {
            "created": string;
            "found": string;
            "foundPlural": string;
            "removed": string;
            "updated": string;
        };
        "statistics": {
            "obtained": string;
        };
        "titles": {
            "created": string;
            "found": string;
            "foundPlural": string;
            "removed": string;
            "updated": string;
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
        "areas": {
            "active": {
                "isIn": string;
                "isNumber": string;
            };
            "description": {
                "isNotEmpty": string;
                "isString": string;
            };
            "icon": {
                "isNotEmpty": string;
                "isString": string;
            };
            "name": {
                "isNotEmpty": string;
                "isString": string;
            };
            "plural": {
                "isNotEmpty": string;
                "isString": string;
            };
        };
        "email": {
            "attachment": {
                "filename": {
                    "isNotEmpty": string;
                    "isString": string;
                };
                "path": {
                    "isNotEmpty": string;
                    "isString": string;
                    "maxFileSize": string;
                };
            };
            "body": string;
            "subject": string;
            "to": string;
        };
        "professionals": {
            "area": {
                "isNotEmpty": string;
                "isString": string;
            };
            "areaCode": {
                "isInt": string;
                "max": string;
                "min": string;
            };
            "available": {
                "isBoolean": string;
                "isNotEmpty": string;
            };
            "configuration": {
                "isNotEmpty": string;
                "isObject": string;
                "scheduleTimeEnd": {
                    "isNotEmpty": string;
                    "isString": string;
                    "minLength": string;
                };
                "scheduleTimeInit": {
                    "isNotEmpty": string;
                    "isString": string;
                    "minLength": string;
                };
                "slotDuration": {
                    "isInt": string;
                    "isPositive": string;
                };
                "timeSlotUnavailableEnd": {
                    "isString": string;
                    "minLength": string;
                };
                "timeSlotUnavailableInit": {
                    "isString": string;
                    "minLength": string;
                };
                "workingDays": {
                    "arrayNotEmpty": string;
                    "arrayMaxSize": string;
                };
            };
            "description": {
                "isString": string;
            };
            "dni": {
                "isNotEmpty": string;
                "isNumber": string;
            };
            "email": {
                "isEmail": string;
                "isNotEmpty": string;
                "isString": string;
            };
            "firstName": {
                "isNotEmpty": string;
                "isString": string;
            };
            "lastName": {
                "isNotEmpty": string;
                "isString": string;
            };
            "phone": {
                "isNotEmpty": string;
                "isNumber": string;
            };
            "specialization": {
                "isNotEmpty": string;
                "isString": string;
            };
            "title": {
                "isNotEmpty": string;
                "isString": string;
            };
            "workingDay": {
                "day": {
                    "isInt": string;
                    "max": string;
                    "min": string;
                };
                "value": {
                    "isBoolean": string;
                };
            };
        };
        "specializations": {
            "active": {
                "isIn": string;
                "isNumber": string;
            };
            "area": {
                "isNotEmpty": string;
                "isString": string;
            };
            "description": {
                "isNotEmpty": string;
                "isString": string;
            };
            "icon": {
                "isNotEmpty": string;
                "isString": string;
            };
            "name": {
                "isNotEmpty": string;
                "isString": string;
            };
            "plural": {
                "isNotEmpty": string;
                "isString": string;
            };
        };
        "titles": {
            "abbreviation": {
                "isNotEmpty": string;
                "isString": string;
            };
            "name": {
                "isNotEmpty": string;
                "isString": string;
            };
        };
    };
};
/* prettier-ignore */
export type I18nPath = Path<I18nTranslations>;
