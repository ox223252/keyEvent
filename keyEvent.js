"use strict";

class KeyEvent extends EventTarget
{
	constructor ( )
	{
		super ( );

		this._list = {};
		this._pendding = {};

		document.addEventListener ( 'keydown', (event)=>{
			if ( ( !this._list?.[ event.key ]?.used )
				|| ( this._list[ short ].diseabled )
				|| ( event.ctrlKey !== this._list[ event.key ].ctrl )
				|| ( event.altKey !== this._list[ event.key ].alt )
				|| ( event.shiftKey !== this._list[ event.key ].shift ) )
			{
				return;
			}

			if ( !event )
			{
				event = window.event;
			}

			if ( event.preventDefault != undefined )
			{
				event.preventDefault ( );
			}
			
			if ( event.stopPropagation )
			{ // IE9 & Other Browsers
				event.stopPropagation ( );
			}
			else
			{ //IE8 and Lower
				event.cancelBubble = true;
			}

			this.dispatchEvent ( new Event ( this._list[ event.key ].event ) );
		});
	}

	initStdShort ( )
	{
		this.shortHand = { short: "a", event: "selectAll",      ctrl: true };
		this.shortHand = { short: "A", event: "unselectAll",    ctrl: true, shift: true };
		this.shortHand = { short: "c", event: "copy",           ctrl: true };
		this.shortHand = { short: "f", event: "find",           ctrl: true };
		this.shortHand = { short: "n", event: "new",            ctrl: true };
		this.shortHand = { short: "o", event: "open",           ctrl: true };
		this.shortHand = { short: "s", event: "save",           ctrl: true };
		this.shortHand = { short: "v", event: "past",           ctrl: true };
		this.shortHand = { short: "w", event: "writeAndClose",  ctrl: true };
		this.shortHand = { short: "x", event: "cut",            ctrl: true };
		this.shortHand = { short: "y", event: "redo",           ctrl: true };
		this.shortHand = { short: "z", event: "undo",           ctrl: true };
	}

	get list ( )
	{
		return Object.keys ( this._list ).map ( k=>this._list[ k ] )
	}

	get help ( )
	{
		return this.list.map ( e=>(e.ctrl?"Ctrl+":"")+(e.alt?"Alt+":"")+(e.shift?"Shift+":"")+e.short+" : "+e.event  );
	}

	set shortHand ( obj )
	{
		if ( obj.short && obj.event )
		{
			let short = obj.short;

			if ( !this._list[ short ] )
			{
				this._list[ short ] = { event: "", ctrl: false, alt: false, shift: false }

				Object.assign ( this._list[ short ], obj );

				// check if event is pendding
				if ( !this._pendding[ obj.event ] )
				{
					return;
				}

				Object.assign ( this._list[ short ], this._pendding[ obj.event ] );
				delete this._pendding[ obj.event ];
			}
			else
			{
				Object.assign ( this._list[ short ], obj );
			}
		}
		else
		{
			throw "invalid object {short:'',event:''}";
		}
	}

	set diseabled ( evName )
	{
		let short = Object.values ( this._list ).filter ( e=>e.event==evName )?.[ 0 ]?.short;

		if ( short )
		{
			this._list[ short ].diseabled = true;
		}
	}

	set enabled ( evName )
	{
		let short = Object.values ( this._list ).filter ( e=>e.event==evName )?.[ 0 ]?.short;

		if ( short )
		{
			delete this._list[ short ].diseabled;
		}
	}

	addEventListener ( evName, callback, options )
	{
		super.addEventListener ( evName, callback, options );

		let short = Object.values ( this._list ).filter ( e=>e.event==evName )?.[ 0 ]?.short;

		if ( !short )
		{
			this._pendding[ evName ] = { used: true }; // save the request on the event name, once the event will be affected to the event that will be cleard
		}
		else
		{
			this._list[ short ].used = true;
		}
	}
}

if ( typeof exports === "object" )
{
	module.exports = keyEvent;
}