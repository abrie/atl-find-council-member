package address

import (
	"net/http"
)

func NewHandler(submitter ProductionSubmitter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		request, err := ParseRequest(r.Body)
		if err != nil {
			http.Error(w, "Address request failed.", http.StatusBadRequest)
			return
		}

		result, err := submitter.Submit(request)
		if err != nil {
			http.Error(w, "Address request failed.", http.StatusInternalServerError)
			return
		}

		WriteResponse(w, result)
	}
}
