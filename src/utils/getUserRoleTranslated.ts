export default function getUserRoleTranslated(role: string): string {
  switch (role) {
    case 'SELLER':
      return 'Vendedor';
    case 'MANAGER':
      return 'Gerente';
    case 'ADMIN':
      return 'Administrador';
    case 'NANOTECH_REPRESENTATIVE':
      return 'Representante da Nanotech';
    case 'SERVICE_PROVIDER':
      return 'Responsável Técnico';
    default:
      return '-';
  }
}
