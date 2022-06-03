function downloadPDF() {
	// Open the PDF in a new window
	window.open("resume.pdf");

	// Downloads the PDF file
	const a = document.createElement("a");
	a.href = "resume.pdf";
	a.download = "Leandro Quevedo - resume.pdf";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

