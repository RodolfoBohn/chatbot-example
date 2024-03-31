export abstract class CommercialServiceRequestRepository {
  abstract addNewServiceRequest(userId: string, ticketId: number);
}
