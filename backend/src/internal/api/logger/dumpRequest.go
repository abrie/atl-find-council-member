package logger

import (
	"log"
	"net/http"
	"net/http/httputil"
)

func DumpRequest(r *http.Request) {
	dump, err := httputil.DumpRequest(r, true)
	if err != nil {
		log.Println("Failed to dump request!")
		return
	}

	log.Println(string(dump))
}
