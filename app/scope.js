const scope = [
  {
    id: 1,
    name: 'personal_info',
    data: [
      'nombre_completo',
      'primer_nombre',
      'segundo_nombre',
      'primer_apellido',
      'segundo_apellido',
      'uid',
      'rid',
    ],
  },
  { id: 2, name: 'profile', data: ['name', 'given_name', 'family_name'] },
  {
    id: 3,
    name: 'document',
    data: ['pais_documento', 'tipo_documento', 'numero_documento'],
  },
  { id: 4, name: 'email', data: ['email', 'email_verified'] },
  { id: 5, name: 'auth_info', data: ['rid', 'nid', 'ae'] },
];

export default scope;
