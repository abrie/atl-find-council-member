package record

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"
)

type ProductionSubmitter struct{}

func buildHttpRequest(request *Request) (*http.Request, error) {
	data := url.Values{}
	data.Add("wsparam[]", strconv.Itoa(request.Ref_ID))
	encodedData := data.Encode()

	url := `http://egis.atlantaga.gov/app/home/php/egisws.php`
	req, err := http.NewRequest("POST", url, strings.NewReader(encodedData))
	if err != nil {
		return nil, fmt.Errorf("Failed to build HTTP request: %v", err)
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("Content-Length", strconv.Itoa(len(encodedData)))

	return req, nil
}

func parseHttpResponse(resp *http.Response) (*Result, error) {
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Fatalf("Response not OK: %v", resp.StatusCode)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("Failed to read response body: %v", err)
	}

	result := make(Result, 0)
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("Failed unmarshal response body: %v", err)
	}

	return &result, nil
}

func (p ProductionSubmitter) Submit(request *Request) (*Result, error) {
	req, err := buildHttpRequest(request)
	if err != nil {
		return nil, fmt.Errorf("Failed to submit request: %v", err)
	}

	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}

	result, err := parseHttpResponse(resp)
	if err != nil {
		return nil, fmt.Errorf("Failed to get result from HTTP response: %v", err)
	}

	return result, nil
}
