type Verifiable = { is_verified?: boolean | null; company?: { is_verified?: boolean | null } | null }

// Verification can be granted to a whole company, so a shop or roaster inherits it from its owner.
export const withCompanyVerification = <T extends Verifiable>(entity: T) =>
  entity.company?.is_verified ? { ...entity, is_verified: true } : entity
