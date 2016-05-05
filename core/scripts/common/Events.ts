// String enums
// See: https://github.com/Microsoft/TypeScript/issues/3192

type EventsEnum = 'Create' | 'Update' | 'Delete';

export const Events = {
    Create: 'Create' as EventsEnum,
    Update: 'Update' as EventsEnum,
    Delete: 'Delete' as EventsEnum
};
