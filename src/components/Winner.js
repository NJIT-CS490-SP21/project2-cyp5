import React, { useState } from 'react';

export function calculateWinner(squares) {
	console.log(squares);
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a,b,c] = lines[i];
		//console.log(squares[a]);
		//console.log(squares[b]);
		//console.log(squares[c]);
		
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			console.log("Hello");
			return squares[a];
		}
	}
	return null;
}