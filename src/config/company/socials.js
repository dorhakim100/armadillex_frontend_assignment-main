export const companySocials = [
  // for now links to my socials :)
  {
    key: 'whatsapp',
    color: 'green-7',
    // getHref: (company) => `https://wa.me/${company.phone}`,
    getHref: () => `https://wa.me/+972542044022`,
    tooltip: 'WhatsApp',
  },
  {
    key: 'linkedin',
    color: 'blue-8',
    // getHref: (company) => company.linkedin,
    getHref: () => 'https://www.linkedin.com/in/dor-hakim/',
    tooltip: 'LinkedIn',
  },
  {
    key: 'email',
    color: 'primary',
    // getHref: (company) => `mailto:${company.email}`,
    getHref: () => `mailto:dorhakim100@gmail.com`,
    tooltip: 'Email',
  },
  // {
  //   key: 'website',
  //   icon: 'mdi-web',
  //   color: 'indigo-7',
  //   getHref: (company) => company.website,
  //   tooltip: 'Visit Website',
  // },
]
