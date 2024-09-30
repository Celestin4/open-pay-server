"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = excludeFields;
function excludeFields(obj, keys) {
    if (Array.isArray(obj)) {
        return obj.map(item => Object.fromEntries(Object.entries(item).filter(([key]) => !keys.includes(key))));
    }
    else {
        return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)));
    }
}
