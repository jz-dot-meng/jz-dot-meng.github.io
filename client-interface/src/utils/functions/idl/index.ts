import { convertSnakeCaseToCamelCase, isDefined } from 'simple-tools';
import { type Root as AnchorIDLNew, IdlTypeDef as IdlTypeDefNew, IdlTypeDefTy as IdlTypeDefTyNew, IdlType as IdlTypeNew } from './anchor_new';
import { type Root as AnchorIDLOld, IdlAccountDef as IdlAccountDefOld, IdlEvent as IdlEventOld, IdlField as IdlFieldOld, IdlTypeDef as IdlTypeDefOld, IdlTypeDefTy as IdlTypeDefTyOld, IdlTypeDefTyStruct as IdlTypeDefTyStructOld, IdlType as IdlTypeOld } from './anchor_old';


function convertType(type: IdlTypeDefTyNew | IdlTypeNew, data?: any): IdlTypeDefTyOld | IdlTypeOld | undefined {
    // Handle primitive types
    if (typeof type === 'string') {
        if (type === 'pubkey') return 'publicKey';
        return type; // Return other primitive types as is
    }

    // Handle object types
    if (typeof type === 'object') {
        // Handle IdlTypeDefTyNew types
        if ('kind' in type) {
            if (type.kind === 'struct') {
                return {
                    kind: 'struct' as const,
                    fields: type.fields ? convertFields(type.fields) : []
                };
            }

            if (type.kind === 'enum') {
                return {
                    kind: 'enum',
                    variants: type.variants.map((variant: any) => ({
                        name: convertSnakeCaseToCamelCase(variant.name),
                        // Add fields conversion if needed
                        fields: variant.fields ? convertFields(variant.fields) : undefined
                    }))
                };
            }

            if (type.kind === 'type') {
                const convertedValue = convertType(type.alias, data);
                if (!convertedValue) return undefined;

                return {
                    kind: 'alias',
                    value: convertedValue as IdlTypeOld
                };
            }
        }

        // Handle IdlType object types
        if ('option' in type) {
            const optionType = convertType(type.option, data);
            if (!optionType) return undefined;

            return {
                option: optionType as IdlTypeOld
            };
        }

        if ('coption' in type) {
            const coptionType = convertType(type.coption, data);
            if (!coptionType) return undefined;

            return {
                coption: coptionType as IdlTypeOld
            };
        }

        if ('vec' in type) {
            const vecType = convertType(type.vec, data);
            if (!vecType) return undefined;

            return {
                vec: vecType as IdlTypeOld
            };
        }

        if ('array' in type) {
            const [arrayType, size] = type.array;
            const convertedArrayType = convertType(arrayType, data);
            if (!convertedArrayType) return undefined;

            return {
                array: [
                    convertedArrayType as IdlTypeOld,
                    typeof size === 'number' ? size : 0 // Handle IdlArrayLen
                ]
            };
        }

        if ('defined' in type) {
            if (typeof type.defined === 'string') {
                return {
                    defined: type.defined
                };
            } else {
                return {
                    defined: type.defined.name
                };
            }
        }
    }

    // If we can't convert, return undefined
    return undefined;
}

// Helper function to convert fields
function convertFields(fields: any[]): IdlFieldOld[] {
    return fields
        .map((field) => {
            if (typeof field === 'string') return undefined;

            // Handle IdlType directly
            if (!('name' in field)) return undefined;

            const convertedType = convertType(field.type);
            if (!convertedType) return undefined;

            return {
                name: convertSnakeCaseToCamelCase(field.name),
                type: convertedType as IdlTypeOld,
                docs: field.docs
            };
        })
        .filter(isDefined);
}

function convertNewIdlTypeToOldIdlAccountDef(type: IdlTypeDefNew | undefined): IdlTypeDefTyStructOld | undefined {
    if (!type) return undefined
    if (type.type.kind !== 'struct') return undefined
    const account: IdlTypeDefTyStructOld = {
        kind: 'struct',
        fields: type.type.fields?.map(f => {
            if (!f) return undefined
            if (typeof f === 'string') return undefined
            if ('name' in f) {
                const convertedType = convertType(f.type);
                if (!convertedType) return undefined;

                return {
                    name: f.name,
                    docs: f.docs,
                    type: convertedType as IdlTypeOld
                }
            }
            return undefined;
        }).filter(isDefined) || []
    }

    return account
}

function convertNewIdlTypeDefToOldEvent(type: IdlTypeDefNew): IdlEventOld | undefined {
    // Only struct types can be converted to events
    if (type.type.kind !== 'struct') return undefined;

    // Extract fields from the struct
    const fields = type.type.fields;
    if (!fields || !Array.isArray(fields)) return undefined;

    return {
        name: type.name,
        fields: fields
            .map(field => {
                // Skip non-object fields or fields without a name
                if (typeof field === 'string' || !('name' in field)) return undefined;

                const convertedType = convertType(field.type);
                if (!convertedType) return undefined;

                return {
                    name: field.name,
                    type: convertedType as IdlTypeOld,
                    index: false // Default to false as the new format doesn't specify this
                };
            })
            .filter(isDefined)
    };
}

export function anchorIDLConvertNewToOld(data: AnchorIDLNew): AnchorIDLOld {
    return {
        version: data.metadata.version,
        name: data.metadata.name,
        instructions: data.instructions.map((instruction) => ({
            name: convertSnakeCaseToCamelCase(instruction.name),
            accounts: instruction.accounts.map((account) => ({
                name: convertSnakeCaseToCamelCase(account.name),
                isMut: account.writable || false,
                isSigner: account.signer || false,
            })),
            args: instruction.args.map((t): IdlFieldOld => {
                if (typeof t.type === 'string' && t.type === 'pubkey') {
                    return {
                        name: t.name,
                        docs: t.docs,
                        type: 'publicKey' as IdlTypeOld
                    };
                }

                const convertedType = convertType(t.type);
                if (!convertedType) {
                    // If we can't convert, return as is but with a type assertion
                    return {
                        name: t.name,
                        docs: t.docs,
                        type: t.type as unknown as IdlTypeOld
                    };
                }

                return {
                    name: t.name,
                    docs: t.docs,
                    type: convertedType as IdlTypeOld
                };
            }),
        })),
        accounts: data.accounts?.map((account): IdlAccountDefOld | undefined => {
            const type = convertNewIdlTypeToOldIdlAccountDef(data.types?.find((type) => type.name === account.name))
            if (!type) return undefined
            return {
                name: account.name,
                type,
            }
        }).filter(isDefined) || [],
        types: data.types?.map((newType): IdlTypeDefOld | undefined => {
            const convertedType = convertType(newType.type)
            if (!convertedType) return undefined
            return {
                name: newType.name,
                type: convertedType as IdlTypeDefTyOld,
            }
        }).filter(isDefined) || [],
        errors: data.errors,
        events: data.events?.map(newEvent => {
            const matchingEvent = data.types?.find(t => t.name === newEvent.name)
            if (!matchingEvent) return undefined
            return convertNewIdlTypeDefToOldEvent(matchingEvent)
        }).filter(isDefined) || [],
        metadata: {
            address: data.address
        },
    };
}

export function isValidAnchorIdlNew(obj: any): obj is AnchorIDLNew {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    // Check required top-level properties
    if (typeof obj.address !== 'string') {
        return false;
    }

    if (typeof obj.metadata !== 'object' || obj.metadata === null) {
        return false;
    }

    if (!Array.isArray(obj.instructions)) {
        return false;
    }

    // Check required properties within metadata
    const metadata = obj.metadata;
    if (typeof metadata.name !== 'string' || typeof metadata.version !== 'string' || typeof metadata.spec !== 'string') {
        return false;
    }

    // Optional: Check types of optional top-level array properties if they exist
    const checkArrayIfPresent = (key: string): boolean => {
        if (key in obj && !Array.isArray(obj[key])) {
            return false;
        }
        return true;
    };

    if (!checkArrayIfPresent('docs')) return false;
    if (!checkArrayIfPresent('accounts')) return false;
    if (!checkArrayIfPresent('events')) return false;
    if (!checkArrayIfPresent('errors')) return false;
    if (!checkArrayIfPresent('types')) return false;
    if (!checkArrayIfPresent('constants')) return false;

    // If all checks pass, it's likely a valid AnchorIDLNew object (at least structurally)
    return true;
}

export function isValidAnchorIdlOld(obj: any): obj is AnchorIDLOld {
    // Basic check: must be an object
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    // Old IDL structure checks
    if (typeof obj.version !== 'string') return false;
    if (typeof obj.name !== 'string') return false;
    if (!Array.isArray(obj.instructions)) return false;

    // Check optional fields (basic type check)
    if ('accounts' in obj && !Array.isArray(obj.accounts)) return false;
    if ('types' in obj && !Array.isArray(obj.types)) return false;
    if ('events' in obj && !Array.isArray(obj.events)) return false;
    if ('errors' in obj && !Array.isArray(obj.errors)) return false;
    if ('constants' in obj && !Array.isArray(obj.constants)) return false;
    // Old format doesn't have 'metadata' field like the new one, but might have a metadata object *within* it
    // We primarily distinguish by the presence/absence of top-level 'address'

    // A simple heuristic: if it has 'version' and 'name' at the top level,
    // and 'instructions' is an array, and it *doesn't* have 'address',
    // it's likely the old format.
    if (typeof obj.address === 'undefined') {
        return true;
    }

    return false; // Fallback
}

export function isValidAnchorIdl(obj: any): obj is AnchorIDLNew | AnchorIDLOld {
    // Basic check first: must be an object
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    // Try new format first as it's more specific (has 'address')
    return isValidAnchorIdlNew(obj) || isValidAnchorIdlOld(obj);
}

