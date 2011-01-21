var Highlighter = Class.create({
	/** 
	Highlighter assumes every form field is a child of an LI element.
	Every form has this HTML structure
	
	<form>
		<ul>
			<li><input /></li>
			<li><input /></li>
		</ul>
	</form>
	
	Highlighter also assumes the CSS has this rule below to highlight the
	LI parent element of the input field.
	
	form li.focused {
	    background-color: #FFF7C0;
	}
	
	**/

	// Add class name of focused to field. On blur remove focused.
	initializeFocus: function(){
		var fields = $$('input', 'textarea', 'select');
		
		// Roll through all the f
		for(i = 0; i < fields.length; i++) {
			if(fields[i].type != 'submit') {
				if(fields[i].type == 'radio' || fields[i].type == 'checkbox') {
					fields[i].observe('click', this.highlight.bind(this));
					fields[i].observe('focus', this.highlight.bind(this));
				}
				else {
					fields[i].observe('focus', this.highlight.bind(this));
				}
			}
		}
	},

	highlight: function(event) {
		//  Remove all the elements with a class of focused
		$$('.focused').invoke('removeClassName', 'focused');
		
		// Find the element that fired the event, then find its parent LI element,
		// Finally add the class name of focused
		var el = Event.findElement(event);
		this.getFieldLI(el).addClassName('focused');
	},
	
	getFieldLI: function(field) {
		// Keep a count of how many parent elements have been visited attempting to find an LI element
		var count = 0;
		var parent = field.parentNode;
		
		// Don't attempt to traverse more than 25 parent elements
		while(count < 25) {
			if(parent.tagName.toLowerCase() == 'li') {
				return $(parent);
			}
			
			count = count + 1;
			parent = parent.parentNode;
		}
		
		return field;
	}
	
});