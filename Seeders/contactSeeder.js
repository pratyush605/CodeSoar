const { ContactName, ContactNumber, ContactNameMapping, ContactUserMapping, User } = require('../Models/index.js');

const seedContactNumber = async () => {
  const countNumber = await ContactNumber.count();
  if (countNumber === 0) {
    const numberData = [
      {phoneNumber: '9876543210', spam: 0},
      {phoneNumber: '9123456789', spam: 0},
      {phoneNumber: '9000011122', spam: 0},
      {phoneNumber: '9988776655', spam: 0},
      {phoneNumber: '7894561230', spam: 0},
      {phoneNumber: '9663322110', spam: 0},
      {phoneNumber: '9911992233', spam: 0},
      {phoneNumber: '8800223344', spam: 0},
      {phoneNumber: '9310011100', spam: 0},
      {phoneNumber: '9555001234', spam: 0},
      {phoneNumber: '9955448877', spam: 0},
      {phoneNumber: '9822223322', spam: 0},
    ];
    await ContactNumber.bulkCreate(numberData);
    console.log('Initial data inserted in ContactNumber table');
  } else {
    console.log('Initial data already exists in ContactNumber table');
  }
}

const seedContactName = async () => {
  const countName = await ContactName.count();
  if (countName === 0) {
    const nameData = [
      {name: 'Mom'},
      {name: 'Dad'},
      {name: 'Office HR'},
      {name: 'Riya'},
      {name: 'Neha Sharma'},
      {name: 'Aman Gupta'},
      {name: 'Aakash S'},
      {name: 'Delivery Guy'},
      {name: 'Doctor Singh'},
      {name: 'Kavita'},
    ];
    await ContactName.bulkCreate(nameData);
    console.log('Initial data inserted in ContactName table');
  } else {
    console.log('Initial data already exists in ContactName table');
  }
}

const seedcontactNameMapping = async () => {
  const countNameMapping = await ContactNameMapping.count();
  if (countNameMapping === 0) {
    const contactNameMappingData = [
      {ContactNameId: 1, ContactNumberId: 6},
      {ContactNameId: 2, ContactNumberId: 7},
      {ContactNameId: 3, ContactNumberId: 8},
      {ContactNameId: 4, ContactNumberId: 2},
      {ContactNameId: 5, ContactNumberId: 3},
      {ContactNameId: 6, ContactNumberId: 4},
      {ContactNameId: 7, ContactNumberId: 1},
      {ContactNameId: 9, ContactNumberId: 9},
      {ContactNameId: 10, ContactNumberId: 5},
      {ContactNameId: 8, ContactNumberId: 10},
      {ContactNameId: 5, ContactNumberId: 11},
      {ContactNameId: 5, ContactNumberId: 12},
    ];
    await ContactNameMapping.bulkCreate(contactNameMappingData);
    console.log('Initial data inserted in ContactNameMapping table');
  } else {
    console.log('Initial data already exists in ContactNameMapping table');
  }
}

const seedcontactUserMapping = async () => {
  const countUserMapping = await ContactUserMapping.count();
  if (countUserMapping === 0) {
    const contactUserMappingData = [
      {UserId: 1, ContactNumberId: 6},
      {UserId: 1, ContactNumberId: 7},
      {UserId: 2, ContactNumberId: 8},
      {UserId: 2, ContactNumberId: 9},
      {UserId: 3, ContactNumberId: 10},
      {UserId: 3, ContactNumberId: 5},
      {UserId: 4, ContactNumberId: 3},
      {UserId: 5, ContactNumberId: 2},
      {UserId: 1, ContactNumberId: 11},
      {UserId: 1, ContactNumberId: 12},
    ];
    await ContactUserMapping.bulkCreate(contactUserMappingData);
    console.log('Initial data inserted in ContactUserMapping table');
  } else {
    console.log('Initial data already exists in ContactUserMapping table');
  }
}

const seedUser = async () => {
  const countUser = await User.count();
  if (countUser === 0) {
    const userData = [
      { name: 'Aakash Singh',
        phoneNumber: '9876543210',
        password: '$2b$12$iltHFLB6WxfxFeNlJLhgLeZi48tmVc2ke4SUnaqDTgHtpcV5Af3oq',
        email: 'aakash@example.com'
      },
      { name: 'Riya Verma',
        phoneNumber: '9123456789',
        password: '$2b$12$iltHFLB6WxfxFeNlJLhgLeZi48tmVc2ke4SUnaqDTgHtpcV5Af3oq',
      },
      { name: 'Neha Sharma',
        phoneNumber: '9000011122',
        password: '$2b$12$iltHFLB6WxfxFeNlJLhgLeZi48tmVc2ke4SUnaqDTgHtpcV5Af3oq',
        email: 'neha@gmail.com'
      },
      { name: 'Aman Gupta',
        phoneNumber: '9988776655',
        password: '$2b$12$iltHFLB6WxfxFeNlJLhgLeZi48tmVc2ke4SUnaqDTgHtpcV5Af3oq',
        email: 'aman@outlook.com'
      },
      { name: 'Kavita Joshi',
        phoneNumber: '7894561230',
        password: '$2b$12$iltHFLB6WxfxFeNlJLhgLeZi48tmVc2ke4SUnaqDTgHtpcV5Af3oq',
      },
    ];
    await User.bulkCreate(userData);
    console.log('Initial data inserted in users table');
  } else {
    console.log('Initial data already exists in users table');
  }
}

const seedInitialData = async () => {
  await seedUser();
  await seedContactNumber();
  await seedContactName();
  await seedcontactNameMapping();
  await seedcontactUserMapping();
};

module.exports = seedInitialData;