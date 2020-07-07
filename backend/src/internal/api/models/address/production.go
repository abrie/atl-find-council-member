package address

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

type ProductionSubmitter struct{}

func parseHttpResponse(resp *http.Response) (*Result, error) {
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Response status not OK: %v", resp.Status)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("Failed to read response body: %v", err)
	}

	var result Result
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("Failed unmarshal response body: %v", err)
	}

	return &result, nil
}

func buildHttpRequest(request *Request) (*http.Request, error) {
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

func (p ProductionSubmitter) Submit(request *Request) (*Result, error) {
	httpRequest, err := buildHttpRequest(request)
	if err != nil {
		return nil, fmt.Errorf("Failed to submit request: %v", err)
	}

	client := http.Client{}
	resp, err := client.Do(httpRequest)
	if err != nil {
		log.Fatal(err)
	}

	result, err := parseHttpResponse(resp)
	if err != nil {
		return nil, fmt.Errorf("Failed to get result from HTTP response: %v", err)
	}

	return result, nil
}
