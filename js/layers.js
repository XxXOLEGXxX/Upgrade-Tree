addLayer("u", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#77BF5F",                       // The color for this layer, which affects many elements.
	symbol: "U",
	position: 0,
    resource: "bought upgrades",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).

    baseResource: "prestige points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.
	effect() { let eff = new Decimal(1)
	           if(hasUpgrade("u", 11)) eff = eff.add(player.u.points)
               if(hasUpgrade("r", 11) && hasUpgrade("r", 13)) eff = eff.mul(new Decimal(2).pow(new Decimal(player.u.points).add(1)))
			   else if(hasUpgrade("r", 11)) eff = eff.mul(2)
			   if(hasUpgrade("r", 12)) eff = eff.mul(upgradeEffect("r", 12))
			   if(hasUpgrade("r", 21)) eff = eff.pow(upgradeEffect("r", 21))
			   return eff },
	effectDescription() { return hasUpgrade("u", 11) ? "boosting your prestige point gain by " + format(this.effect()) + "x" : "" },

    requires: new Decimal(1),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.
    type: "static",                         // Determines the formula used for calculating prestige currency.
	base: 2,
    exponent: 2,                          // "normal" prestige gain is (currency^exponent).
	canBuyMax() { return false },

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return true },            // Returns a bool for if this layer's node should be visible in the tree.
	
	upgrades: {
		rows: 1,
		cols: 1,
		11: {
			title: "Up",
			description: "Bought upgrades has effect.",
			cost: new Decimal(1)
		}
	}
})

addLayer("w", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
		unlockOrder: new Decimal(0),
    }},

    color: "#BF775F",                       // The color for this layer, which affects many elements.
	symbol: "W",
	position: 0,
    resource: "wrong upgrades",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "prestige points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires() { return new Decimal(4).pow((player.r.unlocked&&!player.w.unlocked)?4:1) },             // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.
    type: "static",                         // Determines the formula used for calculating prestige currency.
	base: 3,
    exponent: 3,                          // "normal" prestige gain is (currency^exponent).
	canBuyMax() { return false },

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade("u", 11) || player.w.unlocked },            // Returns a bool for if this layer's node should be visible in the tree.
	branches: ["u"],
	
	upgrades: {
		rows: 4,
		cols: 1,
		11: {
			title: "e",
			description: "Multiplies prestige point gain by x2.",
			cost: new Decimal(1)
		},
		21: {
			title: "p",
			description: "Multiplies prestige point gain by x3.",
			cost: new Decimal(2)
		},
		31: {
			title: "i",
			description: "Multiplies prestige point gain by x5.",
			cost: new Decimal(2),
			unlocked() { return hasUpgrade("w", 21) }
		},
		41: {
			title: "c",
			description: "You gain 10x more prestige points and wrong upgrades affects right upgrade's cost.",
			cost: new Decimal(3),
			effect() { return player.w.points.add(1).pow(player.w.points.add(1)) },
			effectDisplay() { return "/" + format(this.effect()) },
			unlocked() { return hasUpgrade("w", 21) }
		}
	}
})

addLayer("r", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
		unlockOrder: new Decimal(0),
    }},

    color: "#6CD748",                       // The color for this layer, which affects many elements.
	symbol: "R",
	position: 2,
    resource: "right upgrades",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "prestige points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires() { let cost = new Decimal(4).pow((player.w.unlocked&&!player.r.unlocked)?4:1) 
	             if(hasUpgrade("w", 41)) cost = cost.div(upgradeEffect("w", 41))
				 return cost },             // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.
    type: "static",                         // Determines the formula used for calculating prestige currency.
	base: 3,
    exponent: 3,                          // "normal" prestige gain is (currency^exponent).
	canBuyMax() { return false },

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade("u", 11) || player.r.unlocked },            // Returns a bool for if this layer's node should be visible in the tree.
	branches: ["u"],
	
	upgrades: {
		rows: 2,
		cols: 3,
		11: {
			title: "Wise Choice",
			description() { if(hasUpgrade("r", 13)) return "Bought upgrades's effect is doubled and extra per bought upgrade."
			                else return "Bought upgrades's effect is doubled." },
			cost: new Decimal(1)
		},
		12: {
			title: "Wire Chase",
			description: "Right upgrades affects bought upgrades's efefct.",
			effect() { return player.r.points.add(1) },
			effectDisplay() { return "x" + format(this.effect()) },
			cost: new Decimal(2)
		},
		13: {
			title: "Copycating",
			description: "\"Wise Choice\"'s effect is changed.",
			cost: new Decimal(2)
		},
		21: {
			title: "Pastedogging",
			description: "Bought upgrades's effect is exponented by the amount of right upgrades you have.",
			effect() { return new Decimal(player.r.upgrades.length).add(1) },
			effectDisplay() { return "^" + formatWhole(this.effect()) },
			cost: new Decimal(3)
		}
	}
})