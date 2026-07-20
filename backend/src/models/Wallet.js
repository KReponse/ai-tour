// backend/src/models/Wallet.js
// ✅ FIXED - Renamed conflicting canWithdraw method

import mongoose from "mongoose";

/**
 * Wallet Schema
 * 
 * This model stores wallet information for providers and the platform.
 * It supports multiple currencies and tracks both available and pending balances.
 * 
 * Types of Wallets:
 * - provider: Individual provider earnings wallet
 * - platform: AI Tour platform commission wallet
 * - commission: Temporary holding for commission before distribution
 * 
 * Balance Types:
 * - available: Ready for withdrawal
 * - pending: Awaiting confirmation (e.g., 3-day settlement period)
 * - held: On hold (e.g., dispute, escrow)
 * - frozen: Temporarily frozen
 */
const walletSchema = new mongoose.Schema(
{
  // ─── Owner Information ────────────────────────────────────────
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  // ─── Wallet Type ──────────────────────────────────────────────
  type: {
    type: String,
    enum: ["provider", "platform", "commission"],
    required: true,
    default: "provider",
    index: true,
  },

  // ─── Currency ──────────────────────────────────────────────────
  currency: {
    type: String,
    enum: ["USD", "RWF", "EUR", "GBP"],
    default: "USD",
    required: true,
  },

  // ─── Balance Types ─────────────────────────────────────────────
  balances: {
    // ✅ Available balance - ready for withdrawal
    available: {
      type: Number,
      default: 0,
      min: [0, "Available balance cannot be negative"],
    },
    // ✅ Pending balance - awaiting settlement (e.g., 3-day hold)
    pending: {
      type: Number,
      default: 0,
      min: [0, "Pending balance cannot be negative"],
    },
    // ✅ Held balance - on hold for disputes/escrow
    held: {
      type: Number,
      default: 0,
      min: [0, "Held balance cannot be negative"],
    },
    // ✅ Frozen balance - temporarily frozen
    frozen: {
      type: Number,
      default: 0,
      min: [0, "Frozen balance cannot be negative"],
    },
  },

  // ─── Total Balance (Virtual) ──────────────────────────────────
  // Virtual field: total = available + pending + held

  // ─── Transaction History ──────────────────────────────────────
  transactions: [
    {
      transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true,
      },
      type: {
        type: String,
        enum: ["credit", "debit", "adjustment"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      balanceType: {
        type: String,
        enum: ["available", "pending", "held", "frozen"],
        required: true,
      },
      previousBalance: {
        type: Number,
        required: true,
      },
      newBalance: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // ─── Withdrawal Limits ─────────────────────────────────────────
  withdrawalLimits: {
    // Per transaction minimum
    minAmount: {
      type: Number,
      default: 1000, // 1000 RWF or equivalent
    },
    // Per transaction maximum
    maxAmount: {
      type: Number,
      default: 10000000, // 10,000,000 RWF or equivalent
    },
    // Daily withdrawal limit
    dailyLimit: {
      type: Number,
      default: 5000000, // 5,000,000 RWF or equivalent
    },
    // Monthly withdrawal limit
    monthlyLimit: {
      type: Number,
      default: 50000000, // 50,000,000 RWF or equivalent
    },
  },

  // ─── Daily/Withdrawal Counters ─────────────────────────────────
  withdrawalCounters: {
    today: {
      date: {
        type: Date,
        default: () => new Date(),
      },
      count: {
        type: Number,
        default: 0,
      },
      totalAmount: {
        type: Number,
        default: 0,
      },
    },
    thisMonth: {
      month: {
        type: Number,
        default: () => new Date().getMonth(),
      },
      year: {
        type: Number,
        default: () => new Date().getFullYear(),
      },
      totalAmount: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },

  // ─── Status ────────────────────────────────────────────────────
  status: {
    type: String,
    enum: ["active", "suspended", "closed"],
    default: "active",
    index: true,
  },

  // ─── Metadata ──────────────────────────────────────────────────
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },

  // ─── Last Activity ─────────────────────────────────────────────
  lastActivityAt: {
    type: Date,
    default: Date.now,
  },
},
{
  timestamps: true,
});

// =========================
// ✅ INDEXES
// =========================

// Primary lookups
walletSchema.index({ ownerId: 1, currency: 1, type: 1 }, { unique: true });
walletSchema.index({ ownerId: 1, type: 1 });
walletSchema.index({ type: 1, status: 1 });

// Activity tracking
walletSchema.index({ lastActivityAt: -1 });
walletSchema.index({ createdAt: -1 });

// For reporting
walletSchema.index({ "balances.available": 1 });
walletSchema.index({ type: 1, status: 1, "balances.available": 1 });

// =========================
// ✅ VIRTUALS
// =========================

// Total balance = available + pending + held
walletSchema.virtual("totalBalance").get(function() {
  return this.balances.available + this.balances.pending + this.balances.held;
});

// Is wallet active
walletSchema.virtual("isActive").get(function() {
  return this.status === "active";
});

// ✅ RENAMED: Can withdraw virtual (check eligibility)
walletSchema.virtual("isWithdrawable").get(function() {
  return this.status === "active" && this.balances.available > 0;
});

// =========================
// ✅ INSTANCE METHODS
// =========================

/**
 * Add funds to wallet
 */
walletSchema.methods.addFunds = async function(amount, type = "credit", description = "", transactionId = null) {
  if (amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  const previousBalance = this.balances.available;
  this.balances.available += amount;
  this.lastActivityAt = new Date();

  // Record transaction
  this.transactions.push({
    transactionId: transactionId,
    type: type,
    amount: amount,
    balanceType: "available",
    previousBalance: previousBalance,
    newBalance: this.balances.available,
    description: description || "Funds added to wallet",
  });

  await this.save();
  return this;
};

/**
 * Deduct funds from wallet
 */
walletSchema.methods.deductFunds = async function(amount, type = "debit", description = "", transactionId = null) {
  if (amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  if (this.balances.available < amount) {
    throw new Error(`Insufficient funds. Available: ${this.balances.available}, Requested: ${amount}`);
  }

  const previousBalance = this.balances.available;
  this.balances.available -= amount;
  this.lastActivityAt = new Date();

  this.transactions.push({
    transactionId: transactionId,
    type: type,
    amount: amount,
    balanceType: "available",
    previousBalance: previousBalance,
    newBalance: this.balances.available,
    description: description || "Funds deducted from wallet",
  });

  await this.save();
  return this;
};

/**
 * Move funds from pending to available
 */
walletSchema.methods.releasePendingFunds = async function(amount, description = "", transactionId = null) {
  if (amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  if (this.balances.pending < amount) {
    throw new Error(`Insufficient pending funds. Pending: ${this.balances.pending}, Requested: ${amount}`);
  }

  const prevPending = this.balances.pending;
  const prevAvailable = this.balances.available;

  this.balances.pending -= amount;
  this.balances.available += amount;
  this.lastActivityAt = new Date();

  // Record pending release transaction
  this.transactions.push({
    transactionId: transactionId,
    type: "credit",
    amount: amount,
    balanceType: "pending",
    previousBalance: prevPending,
    newBalance: this.balances.pending,
    description: description || "Pending funds released",
  });

  // Record available addition transaction
  this.transactions.push({
    transactionId: transactionId,
    type: "credit",
    amount: amount,
    balanceType: "available",
    previousBalance: prevAvailable,
    newBalance: this.balances.available,
    description: description || "Funds moved from pending to available",
  });

  await this.save();
  return this;
};

/**
 * Hold funds (put in escrow)
 */
walletSchema.methods.holdFunds = async function(amount, description = "", transactionId = null) {
  if (amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  if (this.balances.available < amount) {
    throw new Error(`Insufficient funds. Available: ${this.balances.available}, Requested: ${amount}`);
  }

  const prevAvailable = this.balances.available;
  const prevHeld = this.balances.held;

  this.balances.available -= amount;
  this.balances.held += amount;
  this.lastActivityAt = new Date();

  this.transactions.push({
    transactionId: transactionId,
    type: "debit",
    amount: amount,
    balanceType: "available",
    previousBalance: prevAvailable,
    newBalance: this.balances.available,
    description: description || "Funds placed on hold",
  });

  this.transactions.push({
    transactionId: transactionId,
    type: "credit",
    amount: amount,
    balanceType: "held",
    previousBalance: prevHeld,
    newBalance: this.balances.held,
    description: description || "Funds moved to held balance",
  });

  await this.save();
  return this;
};

/**
 * Release held funds
 */
walletSchema.methods.releaseHeldFunds = async function(amount, description = "", transactionId = null) {
  if (amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  if (this.balances.held < amount) {
    throw new Error(`Insufficient held funds. Held: ${this.balances.held}, Requested: ${amount}`);
  }

  const prevHeld = this.balances.held;
  const prevAvailable = this.balances.available;

  this.balances.held -= amount;
  this.balances.available += amount;
  this.lastActivityAt = new Date();

  this.transactions.push({
    transactionId: transactionId,
    type: "debit",
    amount: amount,
    balanceType: "held",
    previousBalance: prevHeld,
    newBalance: this.balances.held,
    description: description || "Held funds released",
  });

  this.transactions.push({
    transactionId: transactionId,
    type: "credit",
    amount: amount,
    balanceType: "available",
    previousBalance: prevAvailable,
    newBalance: this.balances.available,
    description: description || "Funds moved from held to available",
  });

  await this.save();
  return this;
};

/**
 * Freeze wallet
 */
walletSchema.methods.freeze = async function(reason = "") {
  this.status = "suspended";
  this.metadata.set("freezeReason", reason || "No reason provided");
  this.metadata.set("frozenAt", new Date());
  await this.save();
  return this;
};

/**
 * Unfreeze wallet
 */
walletSchema.methods.unfreeze = async function(reason = "") {
  this.status = "active";
  this.metadata.set("unfreezeReason", reason || "No reason provided");
  this.metadata.set("unfrozenAt", new Date());
  await this.save();
  return this;
};

/**
 * ✅ RENAMED: Check if wallet can withdraw (validation)
 * This checks all conditions for withdrawal eligibility
 */
walletSchema.methods.checkWithdrawEligibility = function(amount) {
  if (this.status !== "active") {
    return { allowed: false, reason: "Wallet is not active" };
  }
  if (this.balances.available < amount) {
    return { allowed: false, reason: `Insufficient funds. Available: ${this.balances.available}` };
  }
  if (this.withdrawalLimits.minAmount && amount < this.withdrawalLimits.minAmount) {
    return { allowed: false, reason: `Amount is less than minimum withdrawal (${this.withdrawalLimits.minAmount})` };
  }
  if (this.withdrawalLimits.maxAmount && amount > this.withdrawalLimits.maxAmount) {
    return { allowed: false, reason: `Amount exceeds maximum withdrawal (${this.withdrawalLimits.maxAmount})` };
  }
  return { allowed: true };
};

/**
 * Update withdrawal counters
 */
walletSchema.methods.updateWithdrawalCounters = async function(amount) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Reset daily counter if new day
  if (this.withdrawalCounters.today.date < today) {
    this.withdrawalCounters.today = {
      date: today,
      count: 0,
      totalAmount: 0,
    };
  }

  // Reset monthly counter if new month
  if (this.withdrawalCounters.thisMonth.month !== now.getMonth() ||
      this.withdrawalCounters.thisMonth.year !== now.getFullYear()) {
    this.withdrawalCounters.thisMonth = {
      month: now.getMonth(),
      year: now.getFullYear(),
      totalAmount: 0,
      count: 0,
    };
  }

  // Check daily limit
  if (this.withdrawalLimits.dailyLimit &&
      this.withdrawalCounters.today.totalAmount + amount > this.withdrawalLimits.dailyLimit) {
    throw new Error(`Daily withdrawal limit exceeded. Remaining: ${this.withdrawalLimits.dailyLimit - this.withdrawalCounters.today.totalAmount}`);
  }

  // Check monthly limit
  if (this.withdrawalLimits.monthlyLimit &&
      this.withdrawalCounters.thisMonth.totalAmount + amount > this.withdrawalLimits.monthlyLimit) {
    throw new Error(`Monthly withdrawal limit exceeded. Remaining: ${this.withdrawalLimits.monthlyLimit - this.withdrawalCounters.thisMonth.totalAmount}`);
  }

  // Update counters
  this.withdrawalCounters.today.count += 1;
  this.withdrawalCounters.today.totalAmount += amount;
  this.withdrawalCounters.thisMonth.count += 1;
  this.withdrawalCounters.thisMonth.totalAmount += amount;

  await this.save();
  return this;
};

// =========================
// ✅ STATIC METHODS
// =========================

/**
 * Get or create wallet for a user
 */
walletSchema.statics.getOrCreateWallet = async function(ownerId, type = "provider", currency = "USD") {
  let wallet = await this.findOne({
    ownerId: ownerId,
    type: type,
    currency: currency,
  });

  if (!wallet) {
    wallet = await this.create({
      ownerId: ownerId,
      type: type,
      currency: currency,
      balances: {
        available: 0,
        pending: 0,
        held: 0,
        frozen: 0,
      },
      status: "active",
    });
    console.log(`📌 Created ${type} wallet for user ${ownerId} (${currency})`);
  }

  return wallet;
};

/**
 * Get wallet balance summary
 */
walletSchema.statics.getBalanceSummary = async function(ownerId) {
  const wallets = await this.find({
    ownerId: ownerId,
    status: "active",
  }).lean();

  const summary = {
    total: 0,
    byCurrency: {},
    byType: {
      provider: 0,
      platform: 0,
      commission: 0,
    },
  };

  for (const wallet of wallets) {
    const total = wallet.balances.available + wallet.balances.pending + wallet.balances.held;
    summary.total += total;

    if (!summary.byCurrency[wallet.currency]) {
      summary.byCurrency[wallet.currency] = 0;
    }
    summary.byCurrency[wallet.currency] += total;

    if (summary.byType[wallet.type] !== undefined) {
      summary.byType[wallet.type] += total;
    }
  }

  return summary;
};

/**
 * Get all wallets for a user
 */
walletSchema.statics.getUserWallets = async function(ownerId) {
  return this.find({
    ownerId: ownerId,
    status: "active",
  }).sort({ type: 1, currency: 1 });
};

/**
 * Transfer between wallets
 */
walletSchema.statics.transfer = async function(fromWalletId, toWalletId, amount, description = "", transactionId = null) {
  const fromWallet = await this.findById(fromWalletId);
  const toWallet = await this.findById(toWalletId);

  if (!fromWallet || !toWallet) {
    throw new Error("Wallet not found");
  }

  if (fromWallet.balances.available < amount) {
    throw new Error(`Insufficient funds in source wallet. Available: ${fromWallet.balances.available}`);
  }

  // Deduct from source
  await fromWallet.deductFunds(amount, "debit", `Transfer to ${toWallet.ownerId} - ${description}`, transactionId);

  // Add to destination
  await toWallet.addFunds(amount, "credit", `Transfer from ${fromWallet.ownerId} - ${description}`, transactionId);

  return { fromWallet, toWallet };
};

export default mongoose.model("Wallet", walletSchema);