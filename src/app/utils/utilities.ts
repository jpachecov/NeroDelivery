import {DeliveryState} from '../core/business.model';

export function getDeliveryStatusName(status: DeliveryState): string {
    switch (status) {
        case DeliveryState.NEW:
            return 'Nuevo';
        case DeliveryState.ASSIGNED:
            return 'Asignado';
        case DeliveryState.ACCEPTED_BY_NERO:
            return 'Aceptado por repartidor';
        case DeliveryState.DELIVERED:
            return 'Entregado';
        case DeliveryState.CANCELED:
            return 'Cancelado';
        case DeliveryState.IN_TRANSIT:
            return 'En transito';
        default:
            return 'Desconocido';
    }
}

export function produceRandom(length: number): string {
    const random13chars = () => {
        return Math.random().toString(16).substring(2, 15);
    };
    const loops = Math.ceil(length / 13);
    return new Array(loops).fill(random13chars).reduce((crtString, func) => {
        return crtString + func();
    }, '').substring(0, length);
}
