function serializeUser(row, viewer) {
  const base = {
    id: row.id,
    tenant_id: row.tenant_id,
    name: row.name,
    role: row.role,
    created_at: row.created_at,
  };

  if (viewer.role === 'admin') {
    return {
      ...base,
      email: row.email,
      manager_id: row.manager_id,
      salary: row.salary,
      ssn: row.ssn,
    };
  }

  if (viewer.role === 'manager') {
    return {
      ...base,
      email: row.email,
      manager_id: row.manager_id,
    };
  }

  if (viewer.role === 'user' && viewer.id === row.id) {
    return base;
  }

  return null;
}

function serializeAccount(row, viewer) {
  const base = {
    id: row.id,
    tenant_id: row.tenant_id,
    user_id: row.user_id,
    account_type: row.account_type,
    balance: row.balance,
    created_at: row.created_at,
  };

  if (viewer.role === 'admin') {
    return {
      ...base,
      billing_card_last4: row.billing_card_last4,
      bank_account: row.bank_account,
    };
  }

  if (viewer.role === 'manager') {
    return base;
  }

  if (viewer.role === 'user' && viewer.id === row.user_id) {
    return base;
  }

  return null;
}

function serializeTransaction(row, viewer) {
  const base = {
    id: row.id,
    tenant_id: row.tenant_id,
    account_id: row.account_id,
    amount: row.amount,
    type: row.type,
    description: row.description,
    created_at: row.created_at,
  };

  if (viewer.role === 'admin') {
    return base;
  }

  if (viewer.role === 'manager') {
    return base;
  }

  if (viewer.role === 'user') {
    return base;
  }

  return null;
}

module.exports = {
  serializeUser,
  serializeAccount,
  serializeTransaction,
};