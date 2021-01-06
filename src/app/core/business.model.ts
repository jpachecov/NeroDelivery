export interface Delivery {
    internalKey?: string;
    packageInfo?: LoadPackageInfo;
    sender?: BusinessInformation | PersonInformation;
    receiver?: BusinessInformation | PersonInformation;
    recollectionPlace?: Place;
    deliveryPlace?: Place;
    deliveryDate?: string;
    status: DeliveryState;
    // UID of the route man user.
    routeManId?: string;
}

export interface UserProfile {
    uid?: string;
    role?: UserRole;
    businessInformation?: BusinessInformation;
    neroInformation?: NeroInformation;
}

export interface BusinessInformation {
    businessName?: string;
    siteUrl?: string;
    rfc?: string;
    place?: Place;
    contact: ContactInformation;
}

export interface PersonInformation {
    contact?: ContactInformation;
    place?: Place;
    rfc?: string;
}

export interface NeroInformation {
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    rfc?: string;
}

export interface LoadPackageInfo {
    externalKey?: string;
    description?: string;
    dimensions?: string;
    weight?: string;
}

export interface ContactInformation {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
}

export interface Place {
    // The complete direction
    address?: string;
    street?: string;
    state?: string;
    city?: string;
    zipCode?: string;
    mapsUrl?: string;
    // Usually used to describe the place.
    references?: string;
}

export enum DeliveryState {
    NEW,
    ASSIGNED,
    IN_TRANSIT,
    DELIVERED,
    CANCELED,
}

export enum UserRole {
    BUSINESS,
    NERO,
    ADMIN
}
