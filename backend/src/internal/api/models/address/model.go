package address

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type Submitter interface {
	SubmitRequest(r *Request) (*Result, error)
}

type Request struct {
	Address string
}

type Result struct {
	Candidates []Candidate `json:"candidates"`
}

type Address string

type Location struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
	M float64 `json:"m"`
}

type Attributes struct {
	Score  float64 `json:"score"`
	Ref_ID int     `json:"Ref_ID"`
}

type Candidate struct {
	Address    Address    `json:"address"`
	Location   Location   `json:"location"`
	Attributes Attributes `json:"attributes"`
}

func ParseRequest(reader io.Reader) (*Request, error) {
	if reader == nil {
		return nil, fmt.Errorf("Request Missing Body.")
	}

	var request Request
	if err := json.NewDecoder(reader).Decode(&request); err != nil {
		return nil, fmt.Errorf("Failed to parse request.")
	}

	return &request, nil
}

func WriteResponse(w http.ResponseWriter, result *Result) {
	if body, err := json.Marshal(result); err == nil {
		w.Header().Set("Content-Type", "application/json")
		w.Write(body)
	} else {
		http.Error(w, "Failed to marshal AddressResult", http.StatusInternalServerError)
	}
}

func BuildHttpRequest(request *Request) (*http.Request, error) {
	url := "https://egis.atlantaga.gov/arc/rest/services/WebLocators/TrAddrPointS/GeocodeServer/findAddressCandidates"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("Failed to build HTTP Request: %v", err)
	}

	q := req.URL.Query()
	q.Add("Single Line Input", request.Address)
	q.Add("f", "json")
	q.Add("outFields", "*")
	q.Add("outSR", `{"wkid":4326}`)
	q.Add("maxLocations", "6")

	req.URL.RawQuery = q.Encode()

	return req, nil
}
