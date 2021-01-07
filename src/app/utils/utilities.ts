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
