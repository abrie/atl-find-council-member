package censusgeocoder

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

type ProductionSubmitter struct{}

type ProductionResponse struct {
	Result Result `json:"result"`
}

func parseHttpResponse(resp *http.Response) (*ProductionResponse, error) {
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Response status not OK: %v", resp.Status)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("Failed to read response body: %v", err)
	}

	var response ProductionResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, fmt.Errorf("Failed unmarshal response body: %v", err)
	}

	return &response, nil
}

func buildHttpRequest(request *Request) (*http.Request, error) {
	url := "https://geocoding.geo.census.gov/geocoder/locations/address"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("Failed to build HTTP Request: %v", err)
	}

	q := req.URL.Query()
	q.Add("street", request.Address.Street)
	q.Add("city", request.Address.City)
	q.Add("state", request.Address.State)
	q.Add("benchmark", "Public_AR_Current")
	q.Add("format", "json")

	req.URL.RawQuery = q.Encode()

	return req, nil
}

func (p ProductionSubmitter) Submit(request *Request) (*Result, error) {
	httpRequest, err := buildHttpRequest(request)
	if err != nil {
		return nil, fmt.Errorf("Failed to submit Geocoder request to remote server: %v", err)
	}

	log.Printf("Making remote geocoder request: %s\n", httpRequest.URL.String())

	client := http.Client{}
	resp, err := client.Do(httpRequest)
	if err != nil {
		log.Fatal(err)
	}

	productionResponse, err := parseHttpResponse(resp)
	if err != nil {
		return nil, fmt.Errorf("Failed to get result from HTTP response: %v", err)
	}

	return &productionResponse.Result, nil
}
