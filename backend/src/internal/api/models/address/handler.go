package address

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func NewHandler(submitter Submitter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		request, err := parseRequest(r.Body)
		if err != nil {
			http.Error(w, "Address request failed.", http.StatusBadRequest)
			return
		}

		result, err := submitter.Submit(request)
		if err != nil {
			http.Error(w, "Address request failed.", http.StatusInternalServerError)
			return
		}

		writeResponse(w, result)
	}
}

func parseRequest(reader io.Reader) (*Request, error) {
	if reader == nil {
		return nil, fmt.Errorf("Request Missing Body.")
	}

	var request Request
	if err := json.NewDecoder(reader).Decode(&request); err != nil {
		return nil, fmt.Errorf("Failed to parse request.")
	}

	return &request, nil
}

func writeResponse(w http.ResponseWriter, result *Result) {
	if body, err := json.Marshal(result); err == nil {
		w.Header().Set("Content-Type", "application/json")
		w.Write(body)
	} else {
		http.Error(w, "Failed to marshal AddressResult", http.StatusInternalServerError)
	}
}
