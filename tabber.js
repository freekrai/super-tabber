var Tabber = Class.create({
	
	// Form fields are stored with the tab index as the key
	formFields: { },
	sortedTabindexes: [ ],
	
	handleTabs: function() {
		// Ignore IE because it already handles tabs correctly.
		if(Prototype.Browser.IE) return;
		
		// A running count of the highest tab index.
		var highestTabIndex = 1;
		
		// Array to store fields with no tab indexes.
		var noTabIndexes = new Array();
		
		// Find all the form fields.
		var fields = $$('input', 'textarea', 'select');
		
		for (var i=0; i < fields.length; i++) {
			// Hidden fields should never receive focus.
			var display = fields[i].getStyle('display');
			
			if(this.fieldIsVisible(fields[i])) {
				var tabIndex = new Number(fields[i].getAttribute('tabindex'));
				
				if(tabIndex > 0) {
					if(tabIndex > highestTabIndex) {
						highestTabIndex = tabIndex;
					}
					
					fields[i].observe('keydown', this.tabToField.bind(this));
					this.formFields[fields[i].getAttribute('tabindex')] = fields[i];
					this.sortedTabindexes.push(fields[i].getAttribute('tabindex'));
				}
				else {
					// Tabber uses the tab index to determine tab order. If a field has no
					// tab index it's added to the end of the tab order.
					noTabIndexes.push(fields[i]);
				}
			}
		}
		
		this.sortedTabindexes.sort(function(a, b) {
			return a - b;
		});
	
		for (var i=0; i < noTabIndexes.length; i++) {
			noTabIndexes[i].observe('keydown', this.tabToField.bind(this));
			
			highestTabIndex = highestTabIndex + 1;
			this.formFields[highestTabIndex] = noTabIndexes[i];
			this.sortedTabindexes.push(highestTabIndex);
		}
	},
	
	fieldIsVisible: function(field) {
		return (field.type != 'hidden' && field.getStyle('display') != 'none');
	},
	
	tabToField: function(event) {
		// The tab key code is 9.
		if(event.keyCode == 9 && this.sortedTabindexes.length > 0) {
			// The next field that will receive focus.
			var nextField;
			
			// The current tab index associated with this event
			var currTabIndex = new Number(event.currentTarget.getAttribute('tabindex'));
			
			// First form field
			var firstField = this.formFields[this.sortedTabindexes[0]];
			
			// Last form field
			var lastField = this.formFields[this.sortedTabindexes[this.sortedTabindexes.length - 1]];
			
			// If shift key pressed go to previous field, otherwise continue down the form.
			// If the focus is on last form field, jump back to top. 
			// If shift + tab key pressed from first field, jump to last field.
			if(!event.shiftKey && currTabIndex == lastField.getAttribute('tabindex')) {
				nextField = firstField;
			}
			else if(event.shiftKey && currTabIndex == firstField.getAttribute('tabindex')) {
				nextField = lastField;
			}
			else {
				for (var i=0; i < this.sortedTabindexes.length; i++) {
					if(this.sortedTabindexes[i] == currTabIndex) {
						var nextTabIndex = (event.shiftKey) ? this.sortedTabindexes[i - 1] : this.sortedTabindexes[i + 1];
						nextField = this.formFields[nextTabIndex];
						break;
					}
				}
			}
			
			if(nextField) {
				nextField.focus();
				
				// Cancel the event so that the form doesn't attempt handle tab key
				Event.stop(event);
			}
		}
	}
	
});