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
	           if(hasUpgrade("l", 11) && hasUpgrade("l", 12) && hasUpgrade("u", 11)) eff = eff.add(player.u.points.add(player.l.points).pow(player.r.points.add(1).mul(5).mul(player.w.points.add(1))))
	           else if(hasUpgrade("l", 11) && hasUpgrade("u", 11)) eff = eff.add(player.u.points.add(player.l.points).pow(player.r.points.add(1).mul(5)))
			   else if(hasUpgrade("u", 11)) eff = eff.add(player.u.points)
			   if(hasUpgrade("u", 11) && hasUpgrade("u", 12)) eff = eff.add(player.w.points.add(player.r.points).add(1).pow(200)).add(player.l.points.add(player.b.points).add(1).pow(400)).add(player.u2.points.add(1).pow(1600))
               if(hasUpgrade("r", 11) && hasUpgrade("r", 13)) eff = eff.mul(new Decimal(2).pow(new Decimal(player.u.points).add(1)))
			   else if(hasUpgrade("r", 11)) eff = eff.mul(2)
			   if(hasUpgrade("r", 12)) eff = eff.mul(upgradeEffect("r", 12))
			   if(hasUpgrade("r", 21)) eff = eff.pow(upgradeEffect("r", 21))
			   return eff },
	effectDescription() { return hasUpgrade("u", 11) ? "boosting your prestige point gain by " + format(this.effect()) + "x" : "" },
	
	update(diff) {
		if(hasUpgrade("u2", 21)) addPoints("u", new Decimal(diff).times(tmp.u.resetGain))
	},

    requires: new Decimal(1),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.
    type: "static",                         // Determines the formula used for calculating prestige currency.
	base() { if(hasUpgrade("l", 21)) return new Decimal(1.1351)
	         else return new Decimal(2) },
    exponent() { if(hasUpgrade("l", 21)) return new Decimal(1.1351)
	             else return new Decimal(2) },                          // "normal" prestige gain is (currency^exponent).
	canBuyMax() { if(hasUpgrade("u2", 15) || hasUpgrade("l", 12)) return true
                  else return false	},

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return true },            // Returns a bool for if this layer's node should be visible in the tree.
	
	upgrades: {
		rows: 1,
		cols: 2,
		11: {
			title: "Up",
			description: "Bought upgrades has effect.",
			cost: new Decimal(1)
		},
		12: {
			title: "grade",
			description: "All upgrade's upgrades are included into bought upgrade's effect.",
			cost: new Decimal(13),
			unlocked() { return hasUpgrade("u2", 13) }
		}
	},
    hotkeys: [
	    {key: "u", description: "U: Reset for bought upgrades", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
        if(layers[resettingLayer].row > this.row) {
			if(!hasUpgrade("u2", 23)) {layerDataReset(this.layer)
			if(hasUpgrade("u2", 11)) player.u.upgrades.push("11")
			if(hasUpgrade("u2", 22)) player.u.upgrades.push("12")}
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

    requires() { let cost = new Decimal(4).pow((player.r.unlocked&&!player.w.unlocked)?4:1) 
	             if(hasUpgrade("w", 51)) cost = cost.div(upgradeEffect("w", 51))
	             return cost },             // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.
    type: "static",                         // Determines the formula used for calculating prestige currency.
	base: 3,
    exponent() { if(hasUpgrade("u2", 15)) return new Decimal(3).sub(layers.u2.effect())
	             else return new Decimal(3) },                          // "normal" prestige gain is (currency^exponent).
	canBuyMax() { if(hasUpgrade("u2", 15)) return true
                  else return false	},

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade("u", 11) || player.w.unlocked },            // Returns a bool for if this layer's node should be visible in the tree.
	branches: ["u"],
	
	upgrades: {
		rows: 5,
		cols: 1,
		11: {
			title: "e",
			description: "multiplies prestige point gain by x2",
			cost: new Decimal(1)
		},
		21: {
			title: "p",
			description: "multiplies prestige point gain by x3",
			cost: new Decimal(2)
		},
		31: {
			title: "i",
			description: "multiplies prestige point gain by x5",
			cost: new Decimal(2),
			unlocked() { return hasUpgrade("w", 21) }
		},
		41: {
			title: "c",
			description: "you gain 10x more prestige points and wrong upgrades affects right upgrades cost",
			cost: new Decimal(3),
			effect() { return player.w.points.add(1).pow(player.w.points.add(1)) },
			effectDisplay() { return "/" + format(this.effect()) },
			unlocked() { return hasUpgrade("w", 21) }
		},
		51: {
			title: "i'm out of ideas lol<br/>¯\_(ツ)_/¯",
			description: "wrong upgrades cost cheapens twice per wrong upgrade",
			cost: new Decimal(1),
			effect() { return new Decimal(2).pow(player.w.points) },
			effectDisplay() { return "/" + format(this.effect()) },
			unlocked() { return hasUpgrade("w", 21) && hasUpgrade("u2", 12) }
		}
	},
    hotkeys: [
	    {key: "w", description: "vv: reset for wrong upgrades", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
        if(layers[resettingLayer].row > this.row) {
			layerDataReset(this.layer)
			if(hasUpgrade("u2", 14)) player.w.upgrades.push("11")
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
	position: 1,
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
	canBuyMax() { if(hasUpgrade("u2", 15) || hasUpgrade("l", 13)) return true
                  else return false	},

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
			description: "Right upgrades affects bought upgrades's effect.",
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
			description: "Bought upgrades's effect is exponented by the amount of right upgrade's upgrades you have.",
			effect() { let eff = new Decimal(player.r.upgrades.length).add(1)
                       if(hasUpgrade("r", 22)) eff = eff.mul(upgradeEffect("r", 22))
					   if(hasUpgrade("l", 13)) eff = eff.pow(eff.root(1.9))
                       return eff },
			effectDisplay() { return "^" + format(this.effect()) },
			cost: new Decimal(3)
		},
		22: {
			title: "Wait a minute...",
			description: "\"Pastedogging\"'s effect is exponented by the amount of wrong upgrade's upgrades you have.<br/>(logged by 10)",
			effect() { let eff = new Decimal(player.w.upgrades.length).add(10).log(10)
					   return eff },
			effectDisplay() { return "^" + format(this.effect()) },
			cost: new Decimal(4),
			unlocked() { return hasUpgrade("u2", 12) }
		}
	},
    hotkeys: [
	    {key: "r", description: "R: Reset for right upgrades", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
        if(layers[resettingLayer].row > this.row) {
			layerDataReset(this.layer)
			if(hasUpgrade("u2", 14)) player.r.upgrades.push("11")
		}
	}
})

addLayer("b", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
		unlockOrder: new Decimal(0),
    }},

    color: "#6CD748",                       // The color for this layer, which affects many elements.
	symbol: "B",
	position: 0,
    resource: "boring upgrades",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).

    baseResource: "wrong upgrades",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.w.points },  // A function to return the current amount of baseResource.

    requires() { let cost = new Decimal(4).pow((player.l.unlocked&&player.u2.unlocked&&!player.b.unlocked)?81:(player.l.unlocked&&!player.b.unlocked || player.u2.unlocked&&!player.b.unlocked)?9:1)
				 return cost },             // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.
    type: "static",                         // Determines the formula used for calculating prestige currency.
	base: 4,
    exponent: 4,                          // "normal" prestige gain is (currency^exponent).
	canBuyMax() { return false },

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade("w", 41) || player.b.unlocked },            // Returns a bool for if this layer's node should be visible in the tree.
	branches: ["w"],
	
	upgrades: {
		rows: 2,
		cols: 3,
		11: {
			title: "test",
			description: "test",
			cost: new Decimal(2)
		},
		12: {
			title: "test",
			description: "test",
			cost: new Decimal(2)
		},
		13: {
			title: "test",
			description: "test",
			cost: new Decimal(2)
		},
		21: {
			title: "test",
			description: "test",
			cost: new Decimal(2)
		}
	}
})

addLayer("l", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
		unlockOrder: new Decimal(0),
    }},

    color: "#6CD748",                       // The color for this layer, which affects many elements.
	symbol: "L",
	position: 1,
    resource: "linear upgrades",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).

    baseResource: "bought upgrades",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.u.points },  // A function to return the current amount of baseResource.

    requires() { let cost = new Decimal(10).pow((player.b.unlocked&&player.u2.unlocked&&!player.l.unlocked)?81:(player.b.unlocked&&!player.l.unlocked || player.u2.unlocked&&!player.l.unlocked)?9:1)
				 return cost },             // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.
    type: "static",                         // Determines the formula used for calculating prestige currency.
	base: 4,
    exponent: 4,                          // "normal" prestige gain is (currency^exponent).
	canBuyMax() { if(hasUpgrade("l", 12)) return true
                  else return false	},

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade("w", 41) && hasUpgrade("r", 21) || player.l.unlocked },            // Returns a bool for if this layer's node should be visible in the tree.
	branches: ["w", "r"],
	
	upgrades: {
		rows: 3,
		cols: 3,
		11: {
			description: "Bought upgrade's effect uses better formula.<br/>[1+u] => [(1+u+l)^((r+1)*5)],",
			cost: new Decimal(1)
		},
		12: {
			description: "Wrong upgrades are included into bought upgrade's effect and you can buy max bought and linear upgrades.<br/> [...r*5)] => [... r*5*(w+1))]",
			cost: new Decimal(2)
		},
		13: {
			title: "Right Path",
			description: "You can buy max right upgrades and \"Pastedogging\" exponents itself.<br/>[eff] => [eff ^ (eff yroot 1.9)]",
			cost: new Decimal(3),
			unlocked() { return !hasUpgrade("l", 31) }
		},
		21: {
			description: "Decreases bought upgrade's base and exponent.<br/> [2/2] => [1.1351/1.1351]",
			cost: new Decimal(2)
		},
		22: {
			title: "test",
			description: "test",
			cost: new Decimal(4)
		},
		23: {
			title: "test",
			description: "test",
			cost: new Decimal(8)
		},
		31: {
			title: "Wrong Path",
			description: "test",
			cost: new Decimal(3),
			unlocked() { return !hasUpgrade("l", 13) }
		},
		32: {
			title: "test",
			description: "test",
			cost: new Decimal(9)
		},
		33: {
			title: "test",
			description: "test",
			cost: new Decimal(27)
		},
	}
})

addLayer("u2", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
		unlockOrder: new Decimal(0),
    }},

    color: "#6CD748",                       // The color for this layer, which affects many elements.
	symbol: "ひ",
	position: 2,
    resource: "unique upgrades",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).

    baseResource: "right upgrades",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.r.points },  // A function to return the current amount of baseResource.
	effect() { let eff = new Decimal(0.645).mul(player.u2.points)
			   return eff },
	effectDescription() { return hasUpgrade("u2", 15) ? "lowering wrong upgrade's exponent by -" + format(this.effect()) : "" },

    requires() { let cost = new Decimal(5).pow((player.l.unlocked&&player.b.unlocked&&!player.u2.unlocked)?81:(player.l.unlocked&&!player.u2.unlocked || player.b.unlocked&&!player.u2.unlocked)?9:1)
	             if(player.u2.points >= 3) cost = new Decimal(Infinity)
				 return cost },             // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.
    type: "static",                         // Determines the formula used for calculating prestige currency.
	base: 4,
    exponent: 4,                          // "normal" prestige gain is (currency^exponent).
	canBuyMax() { return false },

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade("r", 21) || player.u2.unlocked },            // Returns a bool for if this layer's node should be visible in the tree.
	branches: ["r"],
	
	upgrades: {
		rows: 2,
		cols: 5,
		11: {
			title: "Upgrade = Milestone?",
			description: "You keep bought upgrade's first upgrade on 2nd and 3rd row resets.",
			cost: new Decimal(1)
		},
		12: {
			title: "Upgrade = Upgrades!?",
			description: "Adds in 1 upgrade each in 2nd row layers.",
			cost: new Decimal(1),
			unlocked() { return hasUpgrade("u2", 11) }
		},
		13: {
			title: "Upgrades = Upgradess???",
			description: "Adds in 1 upgrade in bought upgrade layer.",
			cost: new Decimal(1),
			unlocked() { return hasUpgrade("u2", 12) }
		},
		14: {
			title: "Upgrade = Save File.<br/>What.",
			description: "Keeps wrong and right upgrade's first upgrades on 3rd row resets.",
			cost: new Decimal(2),
			unlocked() { return hasUpgrade("u2", 13) }
		},
		15: {
			title: "UPGRADE = PROFIT",
			description: "Unique upgrades has effect and you can buy max 1st and 2nd row upgrades.",
			cost: new Decimal(2),
			unlocked() { return hasUpgrade("u2", 14) }
		},
		21: {
			title: "UPGRADE FLOATS ON UPGRADE",
			description: "You gain 100% of bought upgrades.",
			cost: new Decimal(3),
			unlocked() { return hasUpgrade("u2", 15) }
		},
		22: {
			title: "Upgrade = Milestone... Part 2",
			description: "You keep bought upgrade's second upgrade on 2nd and 3rd row resets.",
			cost: new Decimal(3),
			unlocked() { return hasUpgrade("u2", 15) }
		},
		23: {
			title: "Upgrade = resetsNothing",
			description: "2nd and 3rd row resets no longer resets bought upgrade layer.",
			cost: new Decimal(3),
			unlocked() { return hasUpgrade("u2", 15) }
		}
	}
})